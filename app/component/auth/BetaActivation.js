// app/component/auth/BetaActivation.js
'use client'

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AlertCircle, Lock, Sparkles, Zap, CheckCircle, EyeOff, Eye } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import Image from 'next/image';
// Fixed import path - make sure this matches your actual file structure
import logo from '@/app/assets/Vivum.png'; // or wherever your logo is located

const VALID_ACTIVATION_CODES = [
  'VIVUM-BETA-1',
  'VIVUM-BETA-2', 
  'VIVUM-BETA-3',
  'VIVUM-BETA-4',
  'VIVUM-BETA-5'
];

export default function BetaActivation({ onActivationSuccess }) {
  const [activationCode, setActivationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Check if user is already activated in current session
  useEffect(() => {
    const isActivated = sessionStorage.getItem('vivum_beta_activated');
    if (isActivated === 'true') {
      onActivationSuccess();
    }

    // Create particles for background
    const createParticles = () => {
      const particlesContainer = document.querySelector('.activation-particles');
      if (!particlesContainer) return;

      particlesContainer.innerHTML = '';

      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particlesContainer.appendChild(particle);
      }
    };

    createParticles();
  }, [onActivationSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!activationCode.trim()) {
      setError('Please enter an activation code');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isValid = VALID_ACTIVATION_CODES.includes(activationCode.trim().toUpperCase());

    if (isValid) {
      // Store activation only for current session (expires when tab/browser closes)
      sessionStorage.setItem('vivum_beta_activated', 'true');
      sessionStorage.setItem('vivum_activation_code', activationCode.trim().toUpperCase());
      sessionStorage.setItem('vivum_activation_date', new Date().toISOString());
      
      setIsLoading(false);
      onActivationSuccess();
    } else {
      setAttempts(prev => prev + 1);
      setIsLoading(false);
      
      if (attempts >= 2) {
        setError('Invalid activation code. Please use one of the 5 valid beta codes.');
      } else {
        setError('Invalid activation code. Please check and try again.');
      }
      
      // Clear the input after failed attempt
      setActivationCode('');
    }
  };

  const features = [
    { icon: Zap, text: 'Real-time AI Research Analysis' },
    { icon: Sparkles, text: 'Advanced Evidence Synthesis' },
    { icon: Lock, text: 'Exclusive Beta Features' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950">
      {/* Animated background */}
      <div className="animated-bg">
        <div className="grid-pattern"></div>
        <div className="particles activation-particles"></div>
        <div className="energy-waves"></div>
        <div className="gradient-layer"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="relative">
                {/* 3D Sphere with emerging logo */}
                <div className="relative w-16 h-16">
                  {/* Black sphere base with gradient and shadow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl">
                    {/* Inner shadow for depth */}
                    <div className="absolute inset-1 rounded-full bg-gradient-to-tl from-transparent via-gray-800/20 to-gray-700/40"></div>
                    {/* Highlight for 3D effect */}
                    <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-gradient-to-br from-gray-600/60 to-transparent blur-sm"></div>
                  </div>
                  
                  {/* Logo emerging from sphere */}
                  <div className="absolute top-1 left-1 w-14 h-14 rounded-full overflow-hidden border border-gray-700/50 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    {/* Option 1: Using Next.js Image component (Recommended) */}
                    <div className="relative w-full h-full">
                      <Image 
                        src={logo} 
                        alt="Vivum Logo" 
                        fill
                        className="object-cover filter brightness-110 contrast-105"
                        priority
                      />
                      {/* Subtle overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/20 rounded-full"></div>
                    </div>
                  </div>

                  {/* Animated glow ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-pulse"></div>
                  
                  {/* Status indicator */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-950 animate-pulse shadow-lg">
                    <div className="absolute inset-0.5 bg-green-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-3xl text-gray-100" style={{ 
                  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontWeight: '500',
                  letterSpacing: '-0.025em',
                  lineHeight: '1.2'
                }}>
                  Vivum
                </h1>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Evidence Synthesis Platform
            </p>
            <Badge variant="outline" className="mt-2 border-purple-600/30 text-purple-400">
              Private Beta
            </Badge>
          </div>

          {/* Activation form */}
          <Card className="p-6 bg-gray-900/80 backdrop-blur-sm border-gray-800 shadow-2xl">
            <div className="space-y-6">
              <div className="text-center">
                <Lock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  Beta Access Required
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type={showCode ? "text" : "password"}
                    value={activationCode}
                    onChange={(e) => setActivationCode(e.target.value)}
                    placeholder="Enter activation code"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    disabled={isLoading}
                  >
                    {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !activationCode.trim()}
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium transition-all transform hover:scale-[1.02] disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Activate Beta Access
                    </div>
                  )}
                </Button>
              </form>

              {/* Features preview */}
              <div className="pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500 mb-3 text-center">
                  What you&apos;ll get access to:
                </p>

                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <feature.icon className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support link */}
              <div className="text-center pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-500">
                  Need help?{' '}
                  <a href="mailto:connect@vivum.im" className="text-purple-400 hover:text-purple-300 underline">
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </Card>

          {/* Beta info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600">
              Vivum Beta • Advanced Research Platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}