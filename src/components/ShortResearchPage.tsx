import React, { useState } from 'react';
import { ChevronDown, ExternalLink, TrendingUp, TrendingDown, Minus, ArrowLeft } from 'lucide-react';
import { vcData, aiInsights } from '../data/mockData';
import { Company, InsightCard } from '../types';

interface ShortResearchPageProps {
  onNext: () => void;
  onRefine: () => void;
}

const ShortResearchPage: React.FC<ShortResearchPageProps> = ({ onNext, onRefine }) => {
  const [selectedVC, setSelectedVC] = useState(vcData[0]);
  const [showDropdown, setShowDropdown] = useState(false);

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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl font-bold gradient-logo tracking-tight">What did we understand from your ideas?</h2>
          <p className="text-gray-400 text-lg">Here's our AI analysis of your startup concept</p>
        </div>

        {/* AI Insights Section */}
        <div className="space-y-16">
          {/* Business Overview */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center">Business Overview</h3>
            <div className="space-y-4">
              {businessOverviewInsights.map((insight, index) => (
                <div
                  key={index}
                  className="glass-card p-6 space-y-4 card-hover animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getScoreIcon(insight.type)}
                      <h4 className="text-lg font-medium">{insight.title}</h4>
                    </div>
                    <div className={`text-sm font-medium ${getScoreColor(insight.score)}`}>
                      {insight.score}/100
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{insight.insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Research */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-center">Market Research</h3>
            <div className="space-y-4">
              {marketResearchInsights.map((insight, index) => (
                <div
                  key={index}
                  className="glass-card p-6 space-y-4 card-hover animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getScoreIcon(insight.type)}
                      <h4 className="text-lg font-medium">{insight.title}</h4>
                    </div>
                    <div className={`text-sm font-medium ${getScoreColor(insight.score)}`}>
                      {insight.score}/100
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{insight.insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Companies Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-center">
              <h3 className="text-2xl font-semibold mr-4">Similar companies from</h3>
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-800 rounded-full text-sm hover:bg-gray-900 transition-colors"
                >
                  {selectedVC.name} <ChevronDown className="w-4 h-4" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-10 animate-slide-down">
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
              <h4 className="text-xl font-medium text-green-400 text-center">Active Companies</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCompanies.map((company: Company, index) => (
                  <div
                    key={company.id}
                    className={`glass-card p-6 space-y-4 card-hover ${company.gradient} animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {company.logo ? (
                          <img 
                            src={company.logo} 
                            alt={`${company.name} logo`} 
                            className="w-8 h-8 rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-xs font-bold">
                            {company.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h5 className="font-semibold text-lg">{company.name}</h5>
                          <p className="text-gray-400 text-sm">{company.tagline}</p>
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
              <h4 className="text-xl font-medium text-red-400 text-center">Inactive Companies</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inactiveCompanies.map((company: Company, index) => (
                  <div
                    key={company.id}
                    className={`glass-card p-6 space-y-4 opacity-60 ${company.gradient} animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-xs font-bold">
                          {company.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h5 className="font-semibold text-lg">{company.name}</h5>
                          <p className="text-gray-400 text-sm">{company.tagline}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-20 flex items-center justify-center gap-6">
          <button 
            onClick={onRefine} 
            className="button-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Refine
          </button>
          <button onClick={onNext} className="button-primary">
            Start the research
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortResearchPage;