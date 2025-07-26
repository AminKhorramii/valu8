import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';

interface IntroPageProps {
  onComplete: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onComplete }) => {
  const [initialInput, setInitialInput] = useState('');
  const [showFollowup, setShowFollowup] = useState(false);
  const [followupQuestion, setFollowupQuestion] = useState('');
  const [followupAnswer, setFollowupAnswer] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVCMode, setIsVCMode] = useState(false);
  const [roastMode, setRoastMode] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('EU');
  const [linkedinUrls, setLinkedinUrls] = useState<string[]>(['']);
  const [showRegionsDropdown, setShowRegionsDropdown] = useState(false);
  const followupRef = useRef<HTMLDivElement>(null);

  const regions = ['EU', 'US', 'Asia', 'Global'];

  const addLinkedinUrl = () => {
    setLinkedinUrls([...linkedinUrls, '']);
  };

  const removeLinkedinUrl = (index: number) => {
    const newUrls = linkedinUrls.filter((_, i) => i !== index);
    setLinkedinUrls(newUrls.length === 0 ? [''] : newUrls);
  };

  const updateLinkedinUrl = (index: number, value: string) => {
    const newUrls = [...linkedinUrls];
    newUrls[index] = value;
    setLinkedinUrls(newUrls);
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialInput.trim()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/followup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initialInput }),
      });

      const data = await response.json();
      
      if (data.success) {
        setFollowupQuestion(data.question);
        setShowFollowup(true);
      } else {
        // Fallback to mock if API fails
        setFollowupQuestion("What specific problem does your product solve and who is your target customer?");
        setShowFollowup(true);
      }
    } catch (error) {
      // Fallback to mock if API fails
      console.error('Failed to get followup question:', error);
      setFollowupQuestion("What specific problem does your product solve and who is your target customer?");
      setShowFollowup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupAnswer.trim()) return;
    setShowButtons(true);
  };

  useEffect(() => {
    if (showFollowup && followupRef.current) {
      followupRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showFollowup]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold gradient-logo tracking-tight">Valu8</h1>
          {isVCMode && (
            <p className="text-gray-500 text-xs -mt-2">for enterprises</p>
          )}
          <p className="text-gray-400 text-lg">Analyze your idea before making it</p>
          
          {/* Subtle Enterprise Toggle */}
          <button
            onClick={() => setIsVCMode(!isVCMode)}
            className={`subtle-button ${isVCMode ? 'active' : ''}`}
          >
            {isVCMode ? 'Switch to Startup' : 'Enterprise Mode'}
          </button>
        </div>

        <form onSubmit={handleInitialSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={initialInput}
              onChange={(e) => setInitialInput(e.target.value)}
              placeholder="Describe your startup idea..."
              className="input-field w-full pr-48"
              disabled={showFollowup}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* Roast Filter */}
              <button
                type="button"
                onClick={() => setRoastMode(!roastMode)}
                className={`minimal-button px-2 py-1 border border-gray-800 rounded-full text-xs ${roastMode ? 'text-yellow-400 border-yellow-400' : ''}`}
                disabled={showFollowup}
              >
                Roast
              </button>

              {/* Regions Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRegionsDropdown(!showRegionsDropdown)}
                  className="minimal-button px-2 py-1 border border-gray-800 rounded-full flex items-center gap-1 text-xs"
                  disabled={showFollowup}
                >
                  {selectedRegion} <ChevronDown className="w-2 h-2" />
                </button>
                {showRegionsDropdown && (
                  <div className="absolute right-0 mt-2 w-24 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-10">
                    {regions.map((region) => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => {
                          setSelectedRegion(region);
                          setShowRegionsDropdown(false);
                        }}
                        className="w-full text-left px-3 py-1 hover:bg-gray-800 transition-colors text-xs"
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sources Dropdown */}
              <div className="hover-card">
                <button
                  type="button"
                  className="minimal-button px-2 py-1 border border-gray-800 rounded-full flex items-center gap-1 text-xs"
                  disabled={showFollowup}
                >
                  Sources <ChevronDown className="w-2 h-2" />
                </button>
                <div className="hover-card-content">
                  <div className="space-y-1">
                    <div className="hover:bg-gray-800 px-2 py-1 rounded cursor-pointer text-xs">URL</div>
                    <div className="hover:bg-gray-800 px-2 py-1 rounded cursor-pointer text-xs">Words</div>
                    <div className="hover:bg-gray-800 px-2 py-1 rounded cursor-pointer text-xs">Upload File</div>
                    {isVCMode && (
                      <div className="hover:bg-gray-800 px-2 py-1 rounded cursor-pointer text-xs">Team</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enter Button */}
              {!showFollowup && (
                <button
                  type="submit"
                  className="bg-white text-black px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Enter'}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Team LinkedIn URLs (VC Mode Only) */}
        {isVCMode && (
          <div className="space-y-3 animate-fade-in">
            <h3 className="text-gray-400 text-sm">Team LinkedIn URLs</h3>
            <div className="space-y-2">
              {linkedinUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateLinkedinUrl(index, e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="linkedin-input flex-1"
                    disabled={showFollowup}
                  />
                  {linkedinUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLinkedinUrl(index)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      disabled={showFollowup}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addLinkedinUrl}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs"
                disabled={showFollowup}
              >
                <Plus className="w-3 h-3" /> Add team member
              </button>
            </div>
          </div>
        )}

        {showFollowup && (
          <div
            ref={followupRef}
            className="animate-fade-in-up space-y-4"
          >
            <div className="text-gray-400 text-sm">{followupQuestion}</div>
            <form onSubmit={handleFollowupSubmit} className="space-y-4">
              <input
                type="text"
                value={followupAnswer}
                onChange={(e) => setFollowupAnswer(e.target.value)}
                placeholder="Your answer..."
                className="input-field w-full"
                autoFocus
              />
            </form>
          </div>
        )}

        {showButtons && (
          <div className="flex items-center justify-center gap-4 animate-fade-in">
            <button className="button-secondary">
              Share
            </button>
            <button onClick={onComplete} className="button-primary">
              Research
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroPage;