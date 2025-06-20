// app/component/ui/theme-toggle.jsx
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/app/lib/utils';

export function ThemeToggle({ theme, onToggle, className }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={cn(
        "relative h-9 w-9 rounded-lg transition-all duration-300 group",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500",
        "hover:scale-105 active:scale-95",
        className
      )}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Sun icon for light theme */}
        <Sun 
          className={cn(
            "absolute inset-0 w-5 h-5 transition-all duration-500 ease-in-out",
            "text-amber-500 drop-shadow-sm",
            theme === 'dark' 
              ? "rotate-90 scale-0 opacity-0 translate-y-2" 
              : "rotate-0 scale-100 opacity-100 translate-y-0"
          )} 
        />
        
        {/* Moon icon for dark theme */}
        <Moon 
          className={cn(
            "absolute inset-0 w-5 h-5 transition-all duration-500 ease-in-out",
            "text-slate-700 dark:text-purple-400 drop-shadow-sm",
            theme === 'dark' 
              ? "rotate-0 scale-100 opacity-100 translate-y-0" 
              : "-rotate-90 scale-0 opacity-0 -translate-y-2"
          )} 
        />
      </div>
      
      {/* Animated background glow */}
      <div className={cn(
        "absolute inset-0 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100",
        theme === 'dark' 
          ? "bg-gradient-to-br from-purple-500/20 to-purple-600/20" 
          : "bg-gradient-to-br from-amber-400/20 to-orange-500/20"
      )} />
    </Button>
  );
}