// app/components/layout/Header.js
import React from 'react';
import { Menu, X, Sun, Moon, ExternalLink } from 'lucide-react';

export default function Header({ 
  sidebarOpen, 
  setSidebarOpen, 
  darkMode, 
  toggleDarkMode, 
  isSearchView, 
  setIsSearchView,
  showSources,
  setShowSources,
  articles 
}) {
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      
      <div className="flex items-center gap-4">
        {!isSearchView && articles.length > 0 && (
          <button
            onClick={() => setShowSources(true)}
            className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Sources ({articles.length})
          </button>
        )}
        <button
          onClick={() => setIsSearchView(true)}
          className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          New Search
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}