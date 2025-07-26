import React, { useState } from 'react';
import { ChevronDown, ExternalLink, TrendingUp, TrendingDown, Minus, ArrowLeft, BookOpen } from 'lucide-react';
import { vcData, aiInsights } from '../data/mockData';
import { companyStories } from '../data/companyStories';
import { Company, InsightCard } from '../types';
import CompanyStoryPage from './CompanyStoryPage';

interface ShortResearchPageProps {
  onNext: () => void;
  onRefine: () => void;
}

const ShortResearchPage: React.FC<ShortResearchPageProps> = ({ onNext, onRefine }) => {
  const [selectedVC, setSelectedVC] = useState(vcData[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const activeCompanies = selectedVC.companies.filter((c: Company) => c.status === 'active');
  const inactiveCompanies = selectedVC.companies.filter((c: Company) => c.status === 'inactive');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (type: InsightCard['type']) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-400" />;
    }
  };

  const businessOverviewInsights = aiInsights.filter(insight => insight.category === 'Business Overview');
  const marketResearchInsights = aiInsights.filter(insight => insight.category === 'Market Research');

  const openStory = (companyName: string) => {
    const storyKey = companyName.toLowerCase().replace(/\s+/g, '');
    const story = companyStories.find(s => s.id === storyKey);
    if (story) {
      window.open(`/story/${story.id}`, '_blank');
    }
  };

  // If a story is selected, show the story page
  if (selectedStory) {
    const story = companyStories.find(s => s.id === selectedStory);
    if (story) {
      return <CompanyStoryPage story={story} onBack={() => setSelectedStory(null)} />;
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - AI Insights */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">
                What did we understand from your ideas?
              </h2>
              
              {/* Business Overview Section */}
              <div className="space-y-6 mb-12">
                <h3 className="text-xl font-semibold text-gray-300">Business Overview</h3>
                <div className="space-y-4">
                  {businessOverviewInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="glass-card p-5 space-y-3 card-hover"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getScoreIcon(insight.type)}
                          <h4 className="font-medium text-white">{insight.title}</h4>
                        </div>
                        <div className={`text-sm font-medium ${getScoreColor(insight.score)}`}>
                          {insight.score}/100
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{insight.insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Research Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-300">Market Research</h3>
                <div className="space-y-4">
                  {marketResearchInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="glass-card p-5 space-y-3 card-hover"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getScoreIcon(insight.type)}
                          <h4 className="font-medium text-white">{insight.title}</h4>
                        </div>
                        <div className={`text-sm font-medium ${getScoreColor(insight.score)}`}>
                          {insight.score}/100
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{insight.insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Similar Companies */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold text-white">Similar companies from</h2>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-800 rounded-full text-sm hover:bg-gray-900 transition-colors"
                >
                  {selectedVC.name} <ChevronDown className="w-4 h-4" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-10">
                    {vcData.map((vc) => (
                      <button
                        key={vc.id}
                        onClick={() => {
                          setSelectedVC(vc);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors text-sm"
                      >
                        {vc.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Active Companies */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-green-400">Active Companies</h3>
              <div className="space-y-3">
                {activeCompanies.map((company: Company) => (
                  <div
                    key={company.id}
                    className={`glass-card p-4 card-hover ${company.gradient}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {company.logo ? (
                          <img 
                            src={company.logo} 
                            alt={`${company.name} logo`} 
                            className="w-6 h-6 rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-bold">
                            {company.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{company.name}</h4>
                          <p className="text-gray-400 text-xs">{company.tagline}</p>
                        </div>
                      </div>
                      {company.link !== '#' && (
                        <a
                          href={company.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inactive Companies */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-red-400">Inactive Companies</h3>
              <div className="space-y-3">
                {inactiveCompanies.map((company: Company) => {
                  const hasStory = companyStories.some(s => s.id === company.name.toLowerCase().replace(/\s+/g, ''));
                  
                  return (
                    <div
                      key={company.id}
                      className={`glass-card p-4 opacity-60 ${company.gradient}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-xs font-bold">
                            {company.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{company.name}</h4>
                            <p className="text-gray-400 text-xs">{company.tagline}</p>
                          </div>
                        </div>
                        {hasStory && (
                          <button
                            onClick={() => setSelectedStory(company.name.toLowerCase().replace(/\s+/g, ''))}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-yellow-400 hover:text-yellow-300 transition-colors border border-yellow-400/30 rounded hover:border-yellow-400/50"
                          >
                            <BookOpen className="w-3 h-3" />
                            Read the story
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Sticky Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6">
          <button 
            onClick={onRefine} 
            className="button-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Refine
          </button>
          <button onClick={onNext} className="button-primary">
            Now lets do a broad research
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortResearchPage;