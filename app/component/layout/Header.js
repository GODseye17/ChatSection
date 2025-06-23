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
  console.log('Header render - Articles count:', articleCount, 'isSearchView:', isSearchView, 'articles:', articles); // Debug log

  return (
    <header className="h-14 sm:h-16 border-b border-gray-800 flex items-center justify-between px-3 sm:px-4 lg:px-6 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Left section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Burger Menu Button - Always visible */}
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="ghost"
          size="icon"
          className="hover:bg-gray-800 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </Button>

        {/* Logo/Title for mobile when sidebar is closed */}
        {!sidebarOpen && (
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">V</span>
            </div>
            <span className="text-sm sm:text-base font-semibold text-gray-100 hidden xs:block">
              Vivum
            </span>
          </div>
        )}
      </div>
      
      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* System Status Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onShowSystemStatus}
              variant="ghost"
              size="icon"
              className="hover:bg-gray-800 h-8 w-8 sm:h-10 sm:w-10"
            >
              <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>System Status</span>
          </TooltipContent>
        </Tooltip>

        {/* Sources Button - Show when in chat view */}
        {!isSearchView && (
          <Button
            onClick={() => setShowSources(!showSources)}
            variant={showSources ? "default" : "secondary"}
            size="sm"
            className={cn(
              "gap-1 sm:gap-2 relative transition-all h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm",
              showSources && "bg-purple-600 hover:bg-purple-700",
              articleCount === 0 && "opacity-50 cursor-not-allowed"
            )}
            disabled={articleCount === 0}
            title={articleCount === 0 ? "No articles available" : `View ${articleCount} articles`}
          >
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Sources</span>
            <Badge 
              variant={showSources ? "secondary" : "default"}
              className={cn(
                "ml-1 px-1 sm:px-1.5 py-0 text-xs min-w-[16px] sm:min-w-[20px] text-center h-4 sm:h-5",
                articleCount === 0 && "bg-gray-600 text-gray-400"
              )}
            >
              {articleCount}
            </Badge>
          </Button>
        )}
        
        {/* New Search Button */}
        <Button
          onClick={() => setIsSearchView(true)}
          variant="ghost"
          size="sm"
          className="text-purple-400 hover:text-purple-300 hover:bg-gray-800 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
        >
          <span className="hidden sm:inline">New Search</span>
          <span className="sm:hidden">New</span>
        </Button>
        
        {/* Dark Mode Toggle */}
        <Button
          onClick={toggleDarkMode}
          variant="ghost"
          size="icon"
          className="hover:bg-gray-800 h-8 w-8 sm:h-10 sm:w-10"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </Button>
      </div>
    </header>
  );
}