export interface AnalysisCategory {
  name: string;
  score: number;
  feedback: string;
  notes: string[];
}

export interface AnalysisResult {
  overall_score: number;
  categories: AnalysisCategory[];
}

export interface Note {
  id: string;
  content: string;
  x: number;
  y: number;
  category: string;
  type: 'positive' | 'negative' | 'suggestion';
}

export interface InputProps {
  onAnalysis: (content: string) => void;
  isAnalyzing: boolean;
}

export interface AnalysisCanvasProps {
  result: AnalysisResult;
  onReset: () => void;
}