import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Database, Brain, CheckCircle, Search, FileText, Zap, X } from 'lucide-react';

const EnhancedProcessingDialog = ({ 
  isVisible, 
  searchProgress, 
  transformedQuery, 
  onCancel,
  darkMode = true // Accept darkMode prop from parent
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Processing steps with icons and descriptions
  const steps = [
    { icon: Search, title: "Optimizing", description: "Query enhancement" },
    { icon: Database, title: "Fetching", description: "PubMed search" },
    { icon: Brain, title: "Processing", description: "AI analysis" },
    { icon: FileText, title: "Indexing", description: "Final preparation" }
  ];

  // Update step progress based on search progress
  useEffect(() => {
    if (!searchProgress) return;

    const statusMap = {
      'initiating': 0,
      'transforming': 0,
      'fetching': 1,
      'processing': 1,
      'embedding': 2,
      'storing': 3,
      'indexing': 3,
      'finalizing': 3,
      'completed': 4
    };

    const newStep = statusMap[searchProgress.status] || 0;
    setCurrentStep(newStep);
  }, [searchProgress]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Main compact dialog - Uses darkMode prop instead of dark: classes */}
      <div className={`relative backdrop-blur-xl rounded-xl max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300 ${
        darkMode 
          ? 'bg-gray-900/95 border-gray-700/50' 
          : 'bg-white border-gray-200'
      } border`}>
        
        {/* Header */}
        <div className={`relative px-6 py-4 border-b ${
          darkMode ? 'border-gray-700/50' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            {/* Compact animated logo */}
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-purple-700 rounded-full p-2">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${
                darkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Processing Research
              </h3>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {searchProgress?.message || 'Analyzing medical literature...'}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onCancel}
              className={`p-1 transition-colors rounded-full ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Query transformation */}
        {transformedQuery && transformedQuery.is_transformed && (
          <div className={`px-6 py-4 border-b ${
            darkMode 
              ? 'bg-purple-600/5 border-gray-700/50' 
              : 'bg-purple-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className={`w-4 h-4 ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <span className={`text-sm font-medium ${
                darkMode ? 'text-purple-300' : 'text-purple-700'
              }`}>
                Query Optimized
              </span>
            </div>
            
            <div className="space-y-3">
              {/* Original query */}
              <div className={`p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700/30' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <p className="text-xs text-gray-500 mb-1">Original:</p>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-800'
                }`}>
                  {transformedQuery.original_query}
                </p>
              </div>
              
              {/* Optimized query */}
              <div className={`p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-purple-900/20 border-purple-600/20' 
                  : 'bg-purple-100 border-purple-200'
              }`}>
                <p className={`text-xs mb-1 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  MeSH Terms:
                </p>
                <p className={`text-xs font-mono leading-relaxed max-h-20 overflow-y-auto ${
                  darkMode ? 'text-purple-200' : 'text-purple-800'
                }`}>
                  {transformedQuery.transformed_query}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress steps */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className={`text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Progress
            </h4>
            {searchProgress?.attempts && searchProgress?.maxAttempts && (
              <span className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {searchProgress.attempts}/{searchProgress.maxAttempts}
              </span>
            )}
          </div>
          
          {/* Progress steps */}
          <div className="space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 border ${
                    isActive 
                      ? darkMode
                        ? 'bg-purple-600/10 border-purple-600/20'
                        : 'bg-purple-50 border-purple-200'
                      : isCompleted
                      ? darkMode
                        ? 'bg-green-600/5 border-green-600/10'
                        : 'bg-green-50 border-green-200'
                      : darkMode
                        ? 'bg-gray-800/20 border-gray-700/20'
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-purple-600' 
                      : isCompleted
                      ? 'bg-green-600'
                      : darkMode
                        ? 'bg-gray-700'
                        : 'bg-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : isActive ? (
                      <Icon className="w-4 h-4 text-white" />
                    ) : (
                      <Icon className={`w-4 h-4 ${
                        darkMode ? 'text-gray-400' : 'text-white'
                      }`} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h5 className={`text-sm font-medium ${
                      isActive 
                        ? darkMode ? 'text-purple-300' : 'text-purple-700'
                        : isCompleted
                        ? darkMode ? 'text-green-300' : 'text-green-700'
                        : darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </h5>
                    <p className={`text-xs ${
                      isActive 
                        ? darkMode ? 'text-purple-400' : 'text-purple-600'
                        : isCompleted
                        ? darkMode ? 'text-green-400' : 'text-green-600'
                        : 'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  
                  {isActive && (
                    <div className="flex items-center gap-1">
                      <Loader2 className={`w-4 h-4 animate-spin ${
                        darkMode ? 'text-purple-400' : 'text-purple-600'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          {searchProgress?.attempts && searchProgress?.maxAttempts && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Overall Progress</span>
                <span className={`text-xs font-medium ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {Math.round((searchProgress.attempts / searchProgress.maxAttempts) * 100)}%
                </span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${
                darkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <div 
                  className="bg-gradient-to-r from-purple-600 to-purple-500 h-full rounded-full transition-all duration-700 ease-out relative"
                  style={{ 
                    width: `${(searchProgress.attempts / searchProgress.maxAttempts) * 100}%` 
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Status and timing */}
          <div className="mt-4 text-center">
            <p className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {searchProgress?.status === 'completed' 
                ? '✅ Processing complete!' 
                : 'Analyzing research data...'}
            </p>
            {searchProgress?.elapsed && (
              <p className="text-xs text-gray-500 mt-1">
                {Math.floor(searchProgress.elapsed / 60)}:{(searchProgress.elapsed % 60).toString().padStart(2, '0')} elapsed
              </p>
            )}
          </div>

          {/* Cancel button */}
          {/* <div className="mt-4 text-center">
            <button
              onClick={onCancel}
              className={`px-4 py-2 text-sm transition-colors duration-200 rounded-lg border ${
                darkMode 
                  ? 'text-gray-400 hover:text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 border-gray-600/30 hover:border-gray-500/50'
                  : 'text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-gray-300'
              }`}
            >
              Cancel Processing
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default EnhancedProcessingDialog;