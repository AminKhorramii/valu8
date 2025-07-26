import React, { useState, useEffect } from 'react';
import { Key, ExternalLink, Download, Upload, BarChart3, X } from 'lucide-react';
import { ApiKeyManager } from '../utils/apiKeyManager';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySet: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showUsage, setShowUsage] = useState(false);
  const [usageStats, setUsageStats] = useState({ totalTokens: 0, estimatedCost: 0, callCount: 0 });

  useEffect(() => {
    if (isOpen) {
      const existingKey = ApiKeyManager.getApiKey();
      if (existingKey) {
        setApiKey(existingKey);
        setIsValid(true);
      }
      setUsageStats(ApiKeyManager.getUsageStats());
    }
  }, [isOpen]);

  useEffect(() => {
    setIsValid(ApiKeyManager.validateApiKeyFormat(apiKey));
  }, [apiKey]);

  const handleSave = () => {
    if (!isValid) return;
    
    try {
      ApiKeyManager.storeApiKey(apiKey);
      onKeySet();
      onClose();
    } catch (error) {
      alert('Failed to save API key');
    }
  };

  const handleClear = () => {
    ApiKeyManager.clearApiKey();
    ApiKeyManager.clearResearchData();
    setApiKey('');
    setIsValid(false);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Mistral AI Configuration</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* API Key Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">API Key</h3>
              <p className="text-sm text-gray-400 mb-4">
                Your Mistral AI API key stays in your browser only. We never store it on our servers.
              </p>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="ms-xxxxxxxxxxxxxxxxxxxxxxxx"
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                    apiKey && isValid 
                      ? 'border-green-500 focus:ring-green-500' 
                      : apiKey && !isValid 
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-700 focus:ring-gray-600'
                  }`}
                />
                {apiKey && (
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                    isValid ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                )}
              </div>

              {/* {apiKey && !isValid && (
                <p className="text-red-400 text-sm">
                  Invalid API key format. Should start with "ms-" or "mistral-"
                </p>
              )} */}

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Don't have an API key?</span>
                <a
                  href="https://console.mistral.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
                >
                  Get one free <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

    

          {/* Usage Stats */}
          {ApiKeyManager.hasApiKey() && (
            <div className="space-y-3">
              <button
                onClick={() => setShowUsage(!showUsage)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">Usage Statistics</span>
              </button>

              {showUsage && (
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total API calls:</span>
                    <span>{usageStats.callCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tokens used:</span>
                    <span>{usageStats.totalTokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated cost:</span>
                    <span>${usageStats.estimatedCost.toFixed(4)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

  

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={!isValid}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                isValid
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {ApiKeyManager.hasApiKey() ? 'Update Key' : 'Save Key'}
            </button>

            {ApiKeyManager.hasApiKey() && (
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 Your API key and research data stay in your browser. We never see them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;