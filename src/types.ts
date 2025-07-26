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

export interface Company {
  id: string;
  name: string;
  tagline: string;
  link: string;
  status: 'active' | 'inactive';
  gradient: string;
  logo?: string;
}

export interface VC {
  id: string;
  name: string;
  companies: Company[];
}

export interface BusinessCard {
  title: string;
  items: string[];
}

export interface MarketCard {
  title: string;
  items: string[];
}

export interface FollowupResponse {
  question: string;
}

export interface InsightCard {
  category: string;
  title: string;
  insight: string;
  score: number; // 0-100
  type: 'positive' | 'neutral' | 'negative';
}