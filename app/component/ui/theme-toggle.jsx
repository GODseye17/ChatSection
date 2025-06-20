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
        "relative h-9 w-9 rounded-lg transition-all duration-300",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500",
        className
      )}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={cn(
            "absolute inset-0 w-5 h-5 transition-all duration-300",
            "text-amber-500",
            theme === 'dark' 
              ? "rotate-90 scale-0 opacity-0" 
              : "rotate-0 scale-100 opacity-100"
          )} 
        />
        <Moon 
          className={cn(
            "absolute inset-0 w-5 h-5 transition-all duration-300",
            "text-slate-700 dark:text-purple-400",
            theme === 'dark' 
              ? "rotate-0 scale-100 opacity-100" 
              : "-rotate-90 scale-0 opacity-0"
          )} 
        />
      </div>
    </Button>
  );
}