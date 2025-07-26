import React, { useState } from 'react';
import IntroPage from './components/IntroPage';
import ShortResearchPage from './components/ShortResearchPage';
import LongResearchPage from './components/LongResearchPage';

type Page = 'intro' | 'short-research' | 'long-research';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('intro');

  const renderPage = () => {
    switch (currentPage) {
      case 'intro':
        return <IntroPage onComplete={() => setCurrentPage('short-research')} />;
      case 'short-research':
        return <ShortResearchPage 
          onNext={() => setCurrentPage('long-research')} 
          onRefine={() => setCurrentPage('intro')}
        />;
      case 'long-research':
        return <LongResearchPage />;
      default:
        return <IntroPage onComplete={() => setCurrentPage('short-research')} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {renderPage()}
    </div>
  );
}

export default App;