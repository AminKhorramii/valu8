import React, { useState } from 'react';
import InputComponent from './components/InputComponent';
import AnalysisCanvas from './components/AnalysisCanvas';
import { AnalysisResult } from './types';
import { getServerUrl } from './config';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalysis = async (content: string) => {
    setIsAnalyzing(true);
    try {
      const serverUrl = getServerUrl();
      const response = await fetch(`${serverUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle new response format
      if (result.success && result.analysis) {
        setAnalysisResult(result.analysis);
        console.log(`Analysis metadata:`, result.metadata);
      } else if (result.error) {
        throw new Error(result.error);
      } else {
        // Handle old format for backward compatibility
        setAnalysisResult(result);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze pitch. Please check if the server is running and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Pitch Deck Analyzer
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-powered analysis for your startup pitch
          </p>
        </header>

        {!analysisResult ? (
          <InputComponent 
            onAnalysis={handleAnalysis}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <AnalysisCanvas 
            result={analysisResult}
            onReset={() => setAnalysisResult(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;