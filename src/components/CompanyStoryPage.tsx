import React from 'react';
import { ArrowLeft, Calendar, DollarSign, Users, TrendingDown } from 'lucide-react';
import { CompanyStory } from '../data/companyStories';

interface CompanyStoryPageProps {
  story: CompanyStory;
  onBack: () => void;
}

const CompanyStoryPage: React.FC<CompanyStoryPageProps> = ({ story, onBack }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Research
          </button>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <TrendingDown className="w-5 h-5" />
              <span className="text-sm font-medium">Company Story</span>
            </div>
            
            <h1 className="text-4xl font-bold gradient-logo">{story.story.title}</h1>
            
            <p className="text-gray-400 text-lg leading-relaxed">{story.story.summary}</p>
          </div>
        </div>

        {/* Company Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="glass-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Lifespan</span>
            </div>
            <p className="text-white font-medium">{story.foundedYear} - {story.closedYear}</p>
            <p className="text-gray-500 text-xs">{story.closedYear - story.foundedYear} years</p>
          </div>

          <div className="glass-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs">Total Funding</span>
            </div>
            <p className="text-white font-medium">{story.totalFunding}</p>
            <p className="text-gray-500 text-xs">Last valuation: {story.lastValuation}</p>
          </div>

          <div className="glass-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span className="text-xs">Founders</span>
            </div>
            <p className="text-white font-medium">{story.founders.join(', ')}</p>
            <p className="text-gray-500 text-xs">{story.founders.length} founder{story.founders.length > 1 ? 's' : ''}</p>
          </div>

          <div className="glass-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs">Status</span>
            </div>
            <p className="text-red-400 font-medium">Closed</p>
            <p className="text-gray-500 text-xs">{story.tagline}</p>
          </div>
        </div>

        {/* Story Content */}
        <article className="space-y-8">
          {story.story.sections.map((section, index) => (
            <section key={index} className="space-y-4">
              <h2 className="text-2xl font-semibold text-white border-l-4 border-yellow-400 pl-4">
                {section.heading}
              </h2>
              <div className="text-gray-300 leading-relaxed text-lg pl-6">
                {section.content.split('. ').map((sentence, sentenceIndex, sentences) => (
                  <span key={sentenceIndex}>
                    {sentence}
                    {sentenceIndex < sentences.length - 1 ? '. ' : ''}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </article>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-sm">
              This story is part of valu8's comprehensive database of startup failures and successes.
            </p>
            <p className="text-gray-500 text-xs">
              Learn from the past to build a better future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyStoryPage;