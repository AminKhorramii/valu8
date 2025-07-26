# 🚀 Pitch Deck Analyzer

A modern, AI-powered pitch deck analyzer that evaluates startup presentations through voice or text input and provides comprehensive feedback with an interactive notes board.

## ✨ Features

- **🎤 Voice & Text Input**: Toggle between voice recording and text input for maximum accessibility
- **🤖 AI-Powered Analysis**: Uses OpenAI GPT-4o to analyze pitch decks across 10 key categories
- **📊 Interactive Canvas**: Drag-and-drop notes board for visualizing feedback
- **🎨 Dark UI**: Modern interface inspired by Linear and Vercel design systems
- **📈 Observability**: Built-in tracking with ORQ.ai for usage analytics
- **🔊 Speech-to-Text**: Powered by OpenAI Whisper for accurate transcription

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **AI**: OpenAI GPT-4o + Whisper
- **Observability**: ORQ.ai
- **UI**: Dark theme with glass morphism effects

## 📋 Analysis Categories

The AI evaluates pitches across these key areas:

1. **Problem Statement** - Problem clarity and market validation
2. **Solution** - Innovation and value proposition
3. **Market Size** - TAM/SAM/SOM analysis
4. **Business Model** - Revenue model and unit economics
5. **Team** - Experience and domain expertise
6. **Traction** - Growth metrics and validation
7. **Competition** - Competitive landscape understanding
8. **Financial Projections** - Realistic forecasting
9. **Funding Ask** - Justification and use of funds
10. **Go-to-Market Strategy** - Customer acquisition plan

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- OpenAI API key
- ORQ.ai API key (optional)

### Installation

1. **Clone and install dependencies**
   ```bash
   cd pitch-deck-analyzer
   npm install
   ```

2. **Set up environment variables**
   ```bash
   npm run setup
   ```
   
   Then edit `.env` with your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ORQ_API_KEY=your_orq_api_key_here
   PORT=5000
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```
   
   This starts both the React frontend (port 3000) and Express backend (port 5001).

### Manual Setup

If you prefer to run components separately:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm start
```

## 📖 Usage

1. **Open the app** at `http://localhost:3000`
2. **Choose input method**: Toggle between Text or Voice input
3. **Provide your pitch**:
   - **Text**: Describe your startup idea in the text area
   - **Voice**: Click "Start Recording" and speak your pitch
4. **Get analysis**: The AI will evaluate your pitch across all categories
5. **Interactive feedback**: Use the notes board to drag, edit, and organize feedback
6. **Iterate**: Click "New Analysis" to analyze another pitch

## 🎯 Perfect for Hackathons

This tool is designed specifically for hackathon environments:

- **Fast setup** - Get running in minutes
- **No authentication** - Anonymous usage for quick demos
- **Comprehensive feedback** - Helps refine pitches during the event
- **Visual presentation** - Great for showcasing to judges
- **Accessibility focused** - Voice input removes barriers

## 🔧 API Endpoints

### POST `/api/transcribe`
Transcribes audio files using OpenAI Whisper
- **Body**: `multipart/form-data` with audio file
- **Response**: `{ text: string }`

### POST `/api/analyze`
Analyzes pitch content using GPT-4o
- **Body**: `{ content: string }`
- **Response**: Analysis object with scores and feedback

## 🎨 Design System

The UI follows a dark theme inspired by Linear and Vercel:

- **Colors**: Pure black backgrounds with subtle borders
- **Typography**: Inter font family
- **Effects**: Glass morphism cards with backdrop blur
- **Animations**: Smooth transitions and hover effects
- **Components**: Consistent button styles and form inputs

## 📊 Observability

Built-in tracking with ORQ.ai monitors:

- Transcription success/failure rates
- Analysis completion times
- Model performance metrics
- Error tracking and debugging
- Usage analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

---

**Built for hackathons with ❤️**
