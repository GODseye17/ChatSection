// app/component/layout/Header.js
import React from 'react';
import { Menu, X, BookOpen, Activity } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ThemeToggle } from '../ui/theme-toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/app/lib/utils';

export default function Header({ 
  sidebarOpen, 
  setSidebarOpen, 
  theme,
  toggleTheme,
  isSearchView, 
  setIsSearchView,
  showSources,
  setShowSources,
  articles,
  onShowSystemStatus
}) {
  // Ensure articles is an array and get count
  const articleCount = Array.isArray(articles) ? articles.length : 0;

  return (
    <header className={cn(
      "h-16 border-b flex items-center justify-between px-6 sticky top-0 z-30 transition-all duration-300",
      "border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm",
      "dark:border-gray-800 dark:bg-gray-900/95",
      "[data-theme='light'] &:border-gray-200 [data-theme='light'] &:bg-white/95 [data-theme='light'] &:shadow-sm"
    )}>
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="ghost"
          size="icon"
          className={cn(
            "transition-all duration-300 rounded-lg",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "[data-theme='light'] &:hover:bg-gray-100",
            "hover:scale-105 active:scale-95"
          )}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Theme Toggle with enhanced spacing */}
        <ThemeToggle theme={theme} onToggle={toggleTheme} />

        {/* System Status Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onShowSystemStatus}
              variant="ghost"
              size="icon"
              className={cn(
                "transition-all duration-300 rounded-lg",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "[data-theme='light'] &:hover:bg-gray-100",
                "hover:scale-105 active:scale-95"
              )}
            >
              <Activity className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>System Status</span>
          </TooltipContent>
        </Tooltip>

        {/* Professional Sources Button - Purple theme */}
        {!isSearchView && (
          <Button
            onClick={() => setShowSources(!showSources)}
            variant={showSources ? "default" : "secondary"}
            size="sm"
            className={cn(
              "gap-3 relative transition-all duration-300 px-4 py-2 rounded-lg font-medium",
              "hover:scale-105 active:scale-95",
              showSources && "bg-purple-600 hover:bg-purple-700 shadow-lg",
              !showSources && "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
              !showSources && "[data-theme='light'] &:bg-gray-100 [data-theme='light'] &:hover:bg-gray-200",
              articleCount === 0 && "opacity-50 cursor-not-allowed"
            )}
            disabled={articleCount === 0}
            title={articleCount === 0 ? "No articles available" : `View ${articleCount} articles`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Sources</span>
            <Badge 
              variant={showSources ? "secondary" : "default"}
              className={cn(
                "px-2 py-0.5 text-xs min-w-[24px] text-center transition-all duration-300 rounded-md",
                articleCount === 0 && "bg-gray-400 text-gray-600 dark:bg-gray-600 dark:text-gray-400",
                showSources && "bg-white/20 text-white",
                !showSources && "bg-purple-100 text-purple-800 dark:bg-purple-100 dark:text-purple-800",
                !showSources && "[data-theme='light'] &:bg-purple-100 [data-theme='light'] &:text-purple-800"
              )}
            >
              {articleCount}
            </Badge>
          </Button>
        )}
        
        {/* Professional New Search Button - Purple theme */}
        <Button
          onClick={() => setIsSearchView(true)}
          variant="ghost"
          size="sm"
          className={cn(
            "transition-all duration-300 px-4 py-2 rounded-lg font-medium",
            "text-purple-600 hover:text-purple-700 hover:bg-purple-50",
            "dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-950",
            "[data-theme='light'] &:text-purple-600 [data-theme='light'] &:hover:text-purple-700 [data-theme='light'] &:hover:bg-purple-50",
            "hover:scale-105 active:scale-95"
          )}
        >
          New Search
        </Button>
      </div>
    </header>
  );
}