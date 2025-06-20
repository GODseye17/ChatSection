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
  console.log('Header render - Articles count:', articleCount, 'isSearchView:', isSearchView, 'articles:', articles); // Debug log

  return (
    <header className={cn(
      "h-16 border-b flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-200",
      "border-gray-200 bg-white/80 backdrop-blur-sm",
      "dark:border-gray-800 dark:bg-gray-900/80"
    )}>
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="ghost"
          size="icon"
          className={cn(
            "transition-colors duration-200",
            "hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle theme={theme} onToggle={toggleTheme} />

        {/* System Status Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onShowSystemStatus}
              variant="ghost"
              size="icon"
              className={cn(
                "transition-colors duration-200",
                "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <Activity className="w-5 h-5" />
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
              "gap-2 relative transition-all duration-200",
              showSources && "bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700",
              articleCount === 0 && "opacity-50 cursor-not-allowed"
            )}
            disabled={articleCount === 0}
            title={articleCount === 0 ? "No articles available" : `View ${articleCount} articles`}
          >
            <BookOpen className="w-4 h-4" />
            Sources
            <Badge 
              variant={showSources ? "secondary" : "default"}
              className={cn(
                "ml-1 px-1.5 py-0 text-xs min-w-[20px] text-center transition-colors duration-200",
                articleCount === 0 && "bg-gray-400 text-gray-600 dark:bg-gray-600 dark:text-gray-400",
                !showSources && "bg-blue-100 text-blue-800 dark:bg-purple-100 dark:text-purple-800"
              )}
            >
              {articleCount}
            </Badge>
          </Button>
        )}
        
        <Button
          onClick={() => setIsSearchView(true)}
          variant="ghost"
          size="sm"
          className={cn(
            "transition-colors duration-200",
            "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
            "dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-950"
          )}
        >
          New Search
        </Button>
      </div>
    </header>
  );
}