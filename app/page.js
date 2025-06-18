// app/page.js
'use client'

import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';
import { useDarkMode } from './hooks/useDarkMode';

// Auth Components
import BetaActivation from './component/auth/ BetaActivation';
import SessionWarning from './component/auth/SessionWarning';

// Layout Components
import Header from './component/layout/Header';
import Sidebar from './component/layout/Sidebar';
import ApiStatusBar from './component/layout/ApiStatusBar';

// Search Components
import SearchView from './component/search/SearchView';

// Chat Components
import ChatView from './component/chat/ChatView';

// Sources Components
import SourcesOverlay from './component/sources/SourcesOverlay';

export default function VivumPlatform() {
  // Auth state
  const [isActivated, setIsActivated] = useState(false);
  const [isCheckingActivation, setIsCheckingActivation] = useState(true);

  // Core state
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchView, setIsSearchView] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('pubmed');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  
  // Topic state
  const [currentTopicId, setCurrentTopicId] = useState(null);
  const [articles, setArticles] = useState([]);
  const [topicStatus, setTopicStatus] = useState('idle');
  
  // API state
  const [apiStatus, setApiStatus] = useState({ model: false, supabase: false });
  const [conversationHistory, setConversationHistory] = useState([]);

  // Check activation status on mount
  useEffect(() => {
    const checkActivation = () => {
      // Check sessionStorage instead of localStorage (expires when tab closes)
      const activated = sessionStorage.getItem('vivum_beta_activated');
      setIsActivated(activated === 'true');
      setIsCheckingActivation(false);
    };

    // Small delay to prevent flash
    setTimeout(checkActivation, 100);
  }, []);

  // Initialize app after activation
  useEffect(() => {
    if (isActivated) {
      checkAPIStatus();
    }
  }, [isActivated]);

  // Poll topic status when processing
  useEffect(() => {
    if (currentTopicId && topicStatus === 'processing') {
      const interval = setInterval(() => {
        checkTopicStatus(currentTopicId);
      }, 2000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [currentTopicId, topicStatus]);

  // Update loading message when topic is ready
  useEffect(() => {
    if (topicStatus === 'ready' && articles.length > 0) {
      setChatMessages(prev => prev.map(msg => 
        msg.isLoading && msg.isInitialLoad ? {
          ...msg,
          text: `I found ${articles.length} relevant articles from ${selectedSource}. You can now ask me questions about this research topic.`,
          isLoading: false,
          isInitialLoad: false
        } : msg
      ));
    }
  }, [topicStatus, articles.length, selectedSource]);

  const handleActivationSuccess = () => {
    setIsActivated(true);
  };

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem('vivum_beta_activated');
    sessionStorage.removeItem('vivum_activation_code');
    sessionStorage.removeItem('vivum_activation_date');
    
    // Reset app state
    setIsActivated(false);
    setIsSearchView(true);
    setChatMessages([]);
    setCurrentTopicId(null);
    setArticles([]);
    setTopicStatus('idle');
    setConversationHistory([]);
  };

  const checkAPIStatus = async () => {
    try {
      const status = await apiService.checkAPIStatus();
      setApiStatus(status);
    } catch (error) {
      setApiStatus({ model: false, supabase: false });
    }
  };

  const checkTopicStatus = async (topicId) => {
    try {
      const data = await apiService.checkTopicStatus(topicId);
      
      if (data.status === 'completed' || data.status === 'ready') {
        setTopicStatus('ready');
        fetchTopicArticles(topicId);
      }
    } catch (error) {
      // Handle error silently or with user notification
    }
  };

  const fetchTopicArticles = async (topicId) => {
    try {
      const articles = await apiService.fetchTopicArticles(topicId);
      setArticles(articles);
    } catch (error) {
      setArticles([]);
    }
  };

  const handleFetchArticles = async (cleanFilters = null) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setIsSearchView(false);
    
    // Add initial user message
    setChatMessages([{ type: 'user', text: searchQuery }]);
    
    try {
      // Use the cleanFilters passed from SearchView
      const data = await apiService.fetchTopicData(searchQuery, selectedSource, cleanFilters);
      
      if (data.topic_id) {
        setCurrentTopicId(data.topic_id);
        setTopicStatus(data.status);
        
        // Add loading message
        setChatMessages(prev => [...prev, {
          type: 'assistant',
          text: `I'm searching for articles about "${searchQuery}" in ${selectedSource}. This may take a moment...`,
          isLoading: true,
          isInitialLoad: true
        }]);

        // Add to conversation history
        setConversationHistory(prev => [...prev, {
          id: data.topic_id,
          topic: searchQuery,
          timestamp: new Date(),
          source: selectedSource
        }]);
      } else {
        throw new Error('Invalid response: missing topic_id');
      }
    } catch (error) {
      setChatMessages(prev => [...prev, {
        type: 'assistant',
        text: `Sorry, I encountered an error while fetching articles: ${error.message}. Please try again.`,
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !currentTopicId || topicStatus !== 'ready') {
      return;
    }

    const userMessage = chatInput;
    setChatInput('');
    
    // Add user message
    setChatMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    
    // Add loading message
    const loadingMessageId = Date.now();
    setChatMessages(prev => [...prev, {
      id: loadingMessageId,
      type: 'assistant',
      text: 'Analyzing research articles...',
      isLoading: true
    }]);

    try {
      const data = await apiService.sendQuery(userMessage, currentTopicId);
      
      // Remove loading message and add response
      setChatMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      setChatMessages(prev => [...prev, {
        type: 'assistant',
        text: data.response || 'No answer provided',
        citations: data.citations || []
      }]);
    } catch (error) {
      setChatMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      setChatMessages(prev => [...prev, {
        type: 'assistant',
        text: `Sorry, I encountered an error while processing your question: ${error.message}. Please try again.`,
        isError: true
      }]);
    }
  };

  const handleSelectConversation = (conversation) => {
    setCurrentTopicId(conversation.id);
    setSearchQuery(conversation.topic);
    setSelectedSource(conversation.source);
    setIsSearchView(false);
    setSidebarOpen(false);
    fetchTopicArticles(conversation.id);
  };

  // Show loading while checking activation
  if (isCheckingActivation) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Vivum...</p>
        </div>
      </div>
    );
  }

  // Show activation page if not activated
  if (!isActivated) {
    return <BetaActivation onActivationSuccess={handleActivationSuccess} />;
  }

  // Show main app if activated
  return (
    <div className="min-h-screen dark">
      <div className="bg-gray-950 text-gray-100 min-h-screen transition-colors duration-300">
        <ApiStatusBar apiStatus={apiStatus} />
        
        <Sidebar
          sidebarOpen={sidebarOpen}
          conversationHistory={conversationHistory}
          onSelectConversation={handleSelectConversation}
        />

        <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            isSearchView={isSearchView}
            setIsSearchView={setIsSearchView}
            showSources={showSources}
            setShowSources={setShowSources}
            articles={articles}
            onLogout={handleLogout}
          />

          {isSearchView ? (
            <SearchView
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
              handleFetchArticles={handleFetchArticles}
              loading={loading}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
          ) : (
            <ChatView
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleSendMessage={handleSendMessage}
              topicStatus={topicStatus}
              setIsSearchView={setIsSearchView}
              sidebarOpen={sidebarOpen}
            />
          )}
        </div>

        <SourcesOverlay
          showSources={showSources}
          setShowSources={setShowSources}
          articles={articles}
        />

        {/* Session warning for long sessions */}
        <SessionWarning />
      </div>
    </div>
  );
}