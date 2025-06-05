// app/component/auth/SessionWarning.js
'use client'

import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';

export default function SessionWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    const activationDate = sessionStorage.getItem('vivum_activation_date');
    if (!activationDate) return;

    const startTime = new Date(activationDate).getTime();
    
    const updateDuration = () => {
      const now = Date.now();
      const duration = Math.floor((now - startTime) / (1000 * 60)); // minutes
      setSessionDuration(duration);
      
      // Show warning after 30 minutes of session time
      if (duration >= 30 && !localStorage.getItem('session_warning_dismissed')) {
        setShowWarning(true);
      }
    };

    // Update every minute
    const interval = setInterval(updateDuration, 60000);
    updateDuration(); // Initial update

    return () => clearInterval(interval);
  }, []);

  const dismissWarning = () => {
    setShowWarning(false);
    localStorage.setItem('session_warning_dismissed', 'true');
  };

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Alert className="border-amber-500/20 bg-amber-500/10">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-200">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="font-medium mb-1">Session Active</p>
              <p className="text-xs text-amber-200/80">
                You've been active for {sessionDuration} minutes. 
                Remember to save any important work - your session will end when you close this tab.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={dismissWarning}
              className="h-6 w-6 text-amber-400 hover:text-amber-300 hover:bg-amber-500/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}