import React, { useState, useRef, useEffect } from 'react';
import { InputProps } from '../types';
import { getServerUrl } from '../config';

const InputComponent: React.FC<InputProps> = ({ onAnalysis, isAnalyzing }) => {
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const serverUrl = getServerUrl();
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      formData.append('model', 'whisper-1');

      const response = await fetch(`${serverUrl}/api/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      onAnalysis(data.text);
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Failed to transcribe audio. Please try again.');
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onAnalysis(textInput.trim());
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="glass-card p-8">
        {/* Input Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-secondary rounded-lg p-1">
            <button
              onClick={() => setInputMode('text')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                inputMode === 'text'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Text
            </button>
            <button
              onClick={() => setInputMode('voice')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                inputMode === 'voice'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Voice
            </button>
          </div>
        </div>

        {/* Text Input Mode */}
        {inputMode === 'text' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                Describe your pitch deck or startup idea:
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Tell us about your startup: What problem are you solving? What's your solution? Who's your target market? What's your business model? Who's on your team?..."
                className="input-field w-full h-48 resize-none"
                disabled={isAnalyzing}
              />
            </div>
            <button
              onClick={handleTextSubmit}
              disabled={!textInput.trim() || isAnalyzing}
              className="button-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Analyzing...
                </div>
              ) : (
                'Analyze Pitch'
              )}
            </button>
          </div>
        )}

        {/* Voice Input Mode */}
        {inputMode === 'voice' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mb-6">
                <div className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                  isRecording 
                    ? 'border-red-500 bg-red-500/10 scale-110' 
                    : 'border-primary/30 bg-primary/5'
                }`}>
                  <svg
                    className={`w-12 h-12 transition-colors ${
                      isRecording ? 'text-red-500' : 'text-primary'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {isRecording && (
                <div className="mb-4">
                  <div className="text-2xl font-mono text-red-500 mb-2">
                    {formatTime(recordingTime)}
                  </div>
                  <div className="text-sm text-muted-foreground">Recording...</div>
                </div>
              )}

              <div className="space-y-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={isAnalyzing}
                    className="button-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-md font-medium transition-all active:scale-95"
                  >
                    Stop Recording
                  </button>
                )}
                
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Click to start recording your pitch. Speak clearly about your startup idea, 
                  including the problem, solution, market, business model, and team.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputComponent;