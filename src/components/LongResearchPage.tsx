import React, { useState, useRef, useEffect } from 'react';
import { Share, Users, ChevronRight, TrendingUp, TrendingDown, Minus, Clock, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { researchSections, competitiveAnalysisSections, mockTeamAnalysis, ResearchItem } from '../data/longResearchData';
import { ApiKeyManager } from '../utils/apiKeyManager';
import { MistralClient } from '../utils/mistralClient';
import ApiKeyModal from './ApiKeyModal';

interface LongResearchPageProps {
  isVCMode?: boolean;
}

const LongResearchPage: React.FC<LongResearchPageProps> = ({ isVCMode = false }) => {
  const [activeSection, setActiveSection] = useState('business-overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [researchData, setResearchData] = useState(researchSections);
  const [teamAnalysis, setTeamAnalysis] = useState(mockTeamAnalysis);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    sectionRefs.current[sectionId]?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  const getStatusIcon = (status: ResearchItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'coming_soon':
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (score >= 60) return <Minus className="w-4 h-4 text-yellow-400" />;
    return <TrendingDown className="w-4 h-4 text-red-400" />;
  };

  useEffect(() => {
    generateResearch();
  }, []);

  const generateResearch = async () => {
    // Check if we have API key
    if (!ApiKeyManager.hasApiKey()) {
      setShowApiKeyModal(true);
      return;
    }

    // Get saved research inputs
    const savedData = ApiKeyManager.getResearchData();
    if (!savedData?.inputs) {
      console.log('No research inputs found, using mock data');
      return;
    }

    setIsGenerating(true);

    try {
      // Generate comprehensive research
      const research = await MistralClient.generateComprehensiveResearch(savedData.inputs);
      
      if (research && research.research) {
        // Parse and update research sections with API results
        const updatedSections = [...researchSections];
        
        if (research.research.businessOverview) {
          const businessSection = updatedSections.find(s => s.id === 'business-overview');
          if (businessSection && research.research.businessOverview.content) {
            try {
              const parsedData = JSON.parse(research.research.businessOverview.content);
              if (parsedData.items) {
                businessSection.items = parsedData.items;
              }
            } catch (e) {
              console.log('Using fallback for business overview');
            }
          }
        }
        
        if (research.research.marketResearch) {
          const marketSection = updatedSections.find(s => s.id === 'market-research');
          if (marketSection && research.research.marketResearch.content) {
            try {
              const parsedData = JSON.parse(research.research.marketResearch.content);
              if (parsedData.items) {
                marketSection.items = parsedData.items;
              }
            } catch (e) {
              console.log('Using fallback for market research');
            }
          }
        }
        
        if (research.research.launchStrategy) {
          const launchSection = updatedSections.find(s => s.id === 'launch-strategy');
          if (launchSection && research.research.launchStrategy.content) {
            try {
              const parsedData = JSON.parse(research.research.launchStrategy.content);
              if (parsedData.items) {
                launchSection.items = parsedData.items;
              }
            } catch (e) {
              console.log('Using fallback for launch strategy');
            }
          }
        }
        
        if (research.research.fundingStrategy) {
          const fundingSection = updatedSections.find(s => s.id === 'funding-strategy');
          if (fundingSection && research.research.fundingStrategy.content) {
            try {
              const parsedData = JSON.parse(research.research.fundingStrategy.content);
              if (parsedData.items) {
                fundingSection.items = parsedData.items;
              }
            } catch (e) {
              console.log('Using fallback for funding strategy');
            }
          }
        }
        
        setResearchData(updatedSections);
        console.log('Research data updated with API results');
      }

      // Generate team analysis if in VC mode
      if (isVCMode && savedData.inputs.teamUrls?.length > 0) {
        const teamResults = await MistralClient.analyzeTeam(savedData.inputs.teamUrls);
        if (teamResults && teamResults.analysis) {
          try {
            const parsedTeamData = JSON.parse(teamResults.analysis);
            if (Array.isArray(parsedTeamData)) {
              setTeamAnalysis(parsedTeamData);
            }
          } catch (e) {
            console.log('Using fallback team analysis');
          }
        }
      }

    } catch (error) {
      console.error('Research generation failed:', error);
      // Continue with mock data
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-logo">valu8</h1>
          
          <div className="flex items-center gap-4">
            {isGenerating && (
              <div className="flex items-center gap-2 text-yellow-400 text-sm">
                <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                Generating research...
              </div>
            )}

            <button
              onClick={() => setShowApiKeyModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {isVCMode && (
              <button
                onClick={() => setShowTeamModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-colors"
              >
                <Users className="w-4 h-4" />
                Team Analysis
              </button>
            )}
            
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
            >
              <Share className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-80 bg-gray-950/50 border-r border-gray-800 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Research Sections</h2>
              <nav className="space-y-2">
                {researchSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <span className="text-sm font-medium">{section.title}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Analysis Tools</h3>
              <div className="space-y-2">
                {competitiveAnalysisSections.map((section) => (
                  <div
                    key={section.id}
                    className="relative p-3 rounded-lg bg-gray-800/30 border border-gray-700"
                  >
                    <span className="text-sm text-gray-400">{section.title}</span>
                    <div className="absolute top-1 right-1 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-medium">
                      Coming Soon
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-8">
          {researchSections.map((section) => (
            <section
              key={section.id}
              ref={(el) => { 
                sectionRefs.current[section.id] = el; 
              }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                <div className="text-sm text-gray-400">
                  {section.items.filter(item => item.status === 'completed').length} / {section.items.length} completed
                </div>
              </div>

              <div className="grid gap-4">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="glass-card p-6 space-y-4 card-hover"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(item.status)}
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                      </div>
                      {item.score && (
                        <div className="flex items-center gap-2">
                          {getScoreIcon(item.score)}
                          <span className={`text-sm font-medium ${getScoreColor(item.score)}`}>
                            {item.score}/100
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {item.status !== 'coming_soon' ? (
                      <p className="text-gray-300 leading-relaxed">{item.content}</p>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-500">Coming soon - Deep analysis in progress</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Share Research</h3>
            <p className="text-gray-400 mb-6">
              Sharing functionality coming soon! You'll be able to share this research with your team and collaborators.
            </p>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Team Analysis Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold">Team Analysis</h3>
              <p className="text-gray-400 text-sm mt-1">
                AI analysis of your team based on LinkedIn profiles
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {mockTeamAnalysis.map((member, index) => (
                <div key={index} className="glass-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{member.name}</h4>
                      <p className="text-gray-400 text-sm">{member.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getScoreIcon(member.score)}
                      <span className={`text-sm font-medium ${getScoreColor(member.score)}`}>
                        {member.score}/100
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm">{member.experience}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-green-400 text-sm font-medium mb-2">Strengths</h5>
                      <ul className="space-y-1">
                        {member.strengths.map((strength, i) => (
                          <li key={i} className="text-gray-300 text-sm">• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-red-400 text-sm font-medium mb-2">Areas to Address</h5>
                      <ul className="space-y-1">
                        {member.concerns.map((concern, i) => (
                          <li key={i} className="text-gray-300 text-sm">• {concern}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-gray-800">
              <button
                onClick={() => setShowTeamModal(false)}
                className="w-full bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LongResearchPage;