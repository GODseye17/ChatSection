// app/component/layout/Header.js
import React, { useState } from 'react';
import { Menu, X, Sun, Moon, BookOpen, LogOut, Shield, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

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
  onLogout 
}) {
  const [showSessionInfo, setShowSessionInfo] = useState(false);

  // Get session info
  const getSessionInfo = () => {
    const activationCode = sessionStorage.getItem('vivum_activation_code');
    const activationDate = sessionStorage.getItem('vivum_activation_date');
    
    if (activationDate) {
      const date = new Date(activationDate);
      const timeAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60)); // minutes ago
      return {
        code: activationCode,
        timeAgo: timeAgo < 60 ? `${timeAgo}m ago` : `${Math.floor(timeAgo / 60)}h ago`
      };
    }
    
    return null;
  };

  const sessionInfo = getSessionInfo();

  const handleLogoutClick = () => {
    if (window.confirm('Are you sure you want to end this session? You\'ll need to enter the activation code again.')) {
      onLogout();
    }
  };

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

        {/* Session indicator */}
        {sessionInfo && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Shield className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400 font-medium">Active Session</span>
                <Clock className="w-3 h-3 text-green-400/70" />
                <span className="text-xs text-green-400/70">{sessionInfo.timeAgo}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <div>Code: {sessionInfo.code}</div>
                <div>Session expires when tab closes</div>
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {!isSearchView && articles.length > 0 && (
          <Button
            onClick={() => setShowSources(true)}
            variant="secondary"
            size="sm"
            className="gap-2 relative"
          >
            <BookOpen className="w-4 h-4" />
            Sources
            <Badge 
              variant="default" 
              className="ml-1 px-1.5 py-0 text-xs bg-purple-600 hover:bg-purple-600"
            >
              {articles.length}
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

        {/* Logout button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleLogoutClick}
              variant="ghost"
              size="icon"
              className="hover:bg-red-500/10 hover:text-red-400 text-gray-400"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>End Session</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}