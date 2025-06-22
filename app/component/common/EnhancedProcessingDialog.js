// app/component/common/EnhancedProcessingDialog.js
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Sparkles, Database, Brain, CheckCircle, Search, FileText, Zap, X, Activity, Cpu, GitBranch, ArrowDown } from 'lucide-react';

const EnhancedProcessingDialog = ({ 
  isVisible, 
  searchProgress, 
  transformedQuery, 
  onCancel,
  darkMode = true
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const progressIntervalRef = useRef(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [particles, setParticles] = useState([]);
  const [pulseIntensity, setPulseIntensity] = useState(0);

  // Processing steps with smoother transitions
  const steps = [
    { 
      icon: Search, 
      title: "Optimizing Query", 
      description: "Enhancing search parameters",
      duration: 3000, // 3 seconds
      color: darkMode ? '#a78bfa' : '#7c3aed',
      particles: 8
    },
    { 
      icon: Database, 
      title: "Searching Database", 
      description: "Scanning medical literature",
      duration: 4000, // 4 seconds
      color: darkMode ? '#60a5fa' : '#2563eb',
      particles: 12
    },
    { 
      icon: Brain, 
      title: "AI Processing", 
      description: "Analyzing research papers",
      duration: 5000, // 5 seconds
      color: darkMode ? '#34d399' : '#10b981',
      particles: 16
    },
    { 
      icon: FileText, 
      title: "Organizing Results", 
      description: "Preparing your findings",
      duration: 2000, // 2 seconds
      color: darkMode ? '#fbbf24' : '#f59e0b',
      particles: 10
    }
  ];

  // Generate floating particles
  useEffect(() => {
    if (!isVisible) return;

    const generateParticles = () => {
      const step = steps[Math.min(currentStep, steps.length - 1)];
      const newParticles = Array.from({ length: step.particles }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setPulseIntensity(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, [currentStep, isVisible]);

  useEffect(() => {
    if (!isVisible || currentStep >= steps.length) return;

    const animateStepProgress = () => {
      const step = steps[currentStep];
      const increment = 100 / (step.duration / 50); // Update every 50ms
      
      progressIntervalRef.current = setInterval(() => {
        setStepProgress(prev => {
          const newProgress = prev + increment;
          if (newProgress >= 100) {
            clearInterval(progressIntervalRef.current);
            
            // Mark step as completed
            setCompletedSteps(prev => [...prev, currentStep]);
            
            // Transition to next step
            setIsTransitioning(true);
            setTimeout(() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
                setStepProgress(0);
              }
              setIsTransitioning(false);
            }, 300);
            
            return 100;
          }
          return newProgress;
        });
      }, 50);
    };

    // Start animation after a short delay
    const startTimeout = setTimeout(animateStepProgress, 200);

    return () => {
      clearTimeout(startTimeout);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentStep, isVisible]);

  // Update based on actual search progress
  useEffect(() => {
    if (!searchProgress) return;

    const statusMap = {
      'initiating': 0,
      'transforming': 0,
      'fetching': 1,
      'processing': 2,
      'embedding': 2,
      'storing': 3,
      'indexing': 3,
      'finalizing': 3,
      'completed': 4
    };

    const targetStep = statusMap[searchProgress.status] || 0;
    
    // Jump to the correct step if backend is ahead
    if (targetStep > currentStep) {
      setCurrentStep(targetStep);
      setStepProgress(0);
      
      // Mark previous steps as completed
      const newCompleted = [];
      for (let i = 0; i < targetStep; i++) {
        newCompleted.push(i);
      }
      setCompletedSteps(newCompleted);
    }

    // Close dialog when completed
    if (searchProgress.status === 'completed') {
      setTimeout(() => {
        setCompletedSteps([...Array(steps.length).keys()]);
      }, 500);
    }
  }, [searchProgress]);

  if (!isVisible) return null;

  const currentStepData = steps[Math.min(currentStep, steps.length - 1)];
  
  // Calculate overall progress and cap at 95% until completed
  const rawProgress = ((completedSteps.length + (stepProgress / 100)) / steps.length) * 100;
  const overallProgress = searchProgress?.status === 'completed' ? 100 : Math.min(rawProgress, 95);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Compact dialog container */}
      <div className={`relative max-w-md w-full animate-in fade-in zoom-in-95 duration-300`}>
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-xl blur-xl opacity-30 animate-pulse"></div>
        
        {/* Main content */}
        <div className={`relative rounded-xl shadow-2xl overflow-hidden ${
          darkMode 
            ? 'bg-gray-900/95 border-gray-700/50' 
            : 'bg-white/95 border-gray-200'
        } border`}>
          
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" 
              style={{
                backgroundImage: `radial-gradient(circle at 20% 50%, ${currentStepData.color} 0%, transparent 50%),
                                  radial-gradient(circle at 80% 80%, ${currentStepData.color} 0%, transparent 50%),
                                  radial-gradient(circle at 40% 20%, ${currentStepData.color} 0%, transparent 50%)`,
                transform: `scale(${1 + pulseIntensity / 200})`,
                transition: 'transform 0.3s ease-out'
              }}
            />
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map(particle => (
              <div
                key={particle.id}
                className="absolute rounded-full animate-float"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  background: `radial-gradient(circle, ${currentStepData.color} 0%, transparent 70%)`,
                  animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Header */}
          <div className={`relative px-5 py-4 ${
            darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  darkMode ? 'bg-purple-600/20' : 'bg-purple-100'
                }`}>
                  <Brain className={`w-5 h-5 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
                
                <div>
                  <h3 className={`text-lg font-semibold ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    Processing Research
                  </h3>
                  <p className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Query optimized for medical search
                  </p>
                </div>
              </div>

              <button
                onClick={onCancel}
                className={`p-1.5 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Query transformation */}
          {transformedQuery && transformedQuery.is_transformed && (
            <div className={`px-5 py-4 border-y ${
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
              
              <div className="space-y-2">
                {/* Original query */}
                <div className={`p-3 rounded-lg text-xs ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-700/30' 
                    : 'bg-gray-50 border-gray-300'
                } border`}>
                  <p className="text-gray-500 mb-1">Your Search:</p>
                  <p className={`${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {transformedQuery.original_query}
                  </p>
                </div>
                
                {/* Arrow */}
                <div className="flex justify-center py-1">
                  <ArrowDown className={`w-4 h-4 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  } animate-bounce`} />
                </div>
                
                {/* Optimized query */}
                <div className={`p-3 rounded-lg text-xs ${
                  darkMode 
                    ? 'bg-purple-900/20 border-purple-600/20' 
                    : 'bg-purple-100 border-purple-300'
                } border`}>
                  <p className={`mb-1 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                    Optimized MeSH Terms:
                  </p>
                  <p className={`font-mono leading-relaxed max-h-16 overflow-y-auto custom-scrollbar ${
                    darkMode ? 'text-purple-200' : 'text-purple-700'
                  }`}>
                    {transformedQuery.transformed_query}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Progress steps */}
          <div className="px-5 py-4 space-y-3">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = completedSteps.includes(index);
              const isFuture = index > currentStep;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? darkMode
                        ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-600/30'
                        : 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-300'
                      : isCompleted
                      ? darkMode
                        ? 'bg-green-600/10 border-green-600/20'
                        : 'bg-green-50 border-green-200'
                      : darkMode
                        ? 'bg-gray-800/30 border-gray-700/30'
                        : 'bg-gray-50 border-gray-300'
                  } border ${
                    isTransitioning && isActive ? 'scale-105' : 'scale-100'
                  } ${
                    isFuture ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  {/* Icon */}
                  <div className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300`}
                    style={{
                      backgroundColor: isActive || isCompleted ? step.color : darkMode ? '#374151' : '#e5e7eb',
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : isActive ? (
                      <>
                        <StepIcon className="w-5 h-5 text-white animate-pulse" />
                        {/* Progress ring */}
                        <svg className="absolute inset-0 w-10 h-10">
                          <circle
                            cx="20"
                            cy="20"
                            r="18"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="2"
                            fill="none"
                          />
                          <circle
                            cx="20"
                            cy="20"
                            r="18"
                            stroke="white"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 18}`}
                            strokeDashoffset={`${2 * Math.PI * 18 * (1 - stepProgress / 100)}`}
                            transform="rotate(-90 20 20)"
                            className="transition-all duration-200"
                          />
                        </svg>
                      </>
                    ) : (
                      <StepIcon className={`w-5 h-5 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
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
                  
                  {/* Activity indicator */}
                  {isActive && (
                    <div className="flex space-x-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        darkMode ? 'bg-purple-400' : 'bg-purple-600'
                      } animate-bounce`} style={{ animationDelay: '0ms' }}></span>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        darkMode ? 'bg-purple-400' : 'bg-purple-600'
                      } animate-bounce`} style={{ animationDelay: '150ms' }}></span>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        darkMode ? 'bg-purple-400' : 'bg-purple-600'
                      } animate-bounce`} style={{ animationDelay: '300ms' }}></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Overall progress bar */}
          <div className={`px-5 pb-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Overall Progress</span>
              <span className={`text-xs font-bold ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {Math.round(overallProgress)}%
              </span>
            </div>
            <div className={`relative w-full rounded-full h-2 overflow-hidden ${
              darkMode ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out relative"
                style={{ 
                  width: `${overallProgress}%`,
                  background: darkMode 
                    ? 'linear-gradient(90deg, #a78bfa, #60a5fa, #34d399)'
                    : 'linear-gradient(90deg, #7c3aed, #2563eb, #10b981)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProcessingDialog;