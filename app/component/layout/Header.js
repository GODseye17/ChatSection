// app/component/layout/Header.js
import React from 'react';
import { Menu, X, Sun, Moon, BookOpen, Activity } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/app/lib/utils';

export default function Header({ 
  sidebarOpen, 
  setSidebarOpen, 
  darkMode, 
  toggleDarkMode, 
  isSearchView, 
  setIsSearchView,
  showSources,
  setShowSources,
  articles,
  onShowSystemStatus
}) {
  // Ensure articles is an array and get count
  const articleCount = Array.isArray(articles) ? articles.length : 0;
  console.log('Header - Articles:', articles, 'Count:', articleCount, 'isSearchView:', isSearchView); // Debug log

  return (
    <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="ghost"
          size="icon"
          className="hover:bg-gray-800"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        {/* System Status Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onShowSystemStatus}
              variant="ghost"
              size="icon"
              className="hover:bg-gray-800"
            >
              <Activity className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>System Status</span>
          </TooltipContent>
        </Tooltip>

        {/* Sources Button - Show when in chat view and we have articles */}
        {!isSearchView && (
          <Button
            onClick={() => setShowSources(!showSources)}
            variant={showSources ? "default" : "secondary"}
            size="sm"
            className={cn(
              "gap-2 relative transition-all",
              showSources && "bg-purple-600 hover:bg-purple-700",
              articleCount === 0 && "opacity-50"
            )}
            disabled={articleCount === 0}
          >
            <BookOpen className="w-4 h-4" />
            Sources
            <Badge 
              variant={showSources ? "secondary" : "default"}
              className="ml-1 px-1.5 py-0 text-xs min-w-[20px] text-center"
            >
              {articleCount}
            </Badge>
          </Button>
        )}
        
        <Button
          onClick={() => setIsSearchView(true)}
          variant="ghost"
          size="sm"
          className="text-purple-400 hover:text-purple-300"
        >
          New Search
        </Button>
        
        <Button
          onClick={toggleDarkMode}
          variant="ghost"
          size="icon"
          className="hover:bg-gray-800"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
}