// app/page.js
'use client'

import React, { useState, useEffect } from 'react';
import { apiService } from './services/api';
import { useDarkMode } from './hooks/useDarkMode';

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

  // Check API status on mount
  useEffect(() => {
    console.log('🎯 Vivum Platform initialized');
    checkAPIStatus();
  }, []);

  // Poll topic status when processing
  useEffect(() => {
    if (currentTopicId && topicStatus === 'processing') {
      console.log('⏱️ Starting topic status polling...');
      const interval = setInterval(() => {
        checkTopicStatus(currentTopicId);
      }, 2000);
      return () => {
        console.log('⏹️ Stopping topic status polling');
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

  const checkAPIStatus = async () => {
    try {
      const status = await apiService.checkAPIStatus();
      setApiStatus(status);
    } catch (error) {
      console.error('❌ Critical error checking API status:', error);
      setApiStatus({ model: false, supabase: false });
    }
  };

  const checkTopicStatus = async (topicId) => {
    try {
      const data = await apiService.checkTopicStatus(topicId);
      
      if (data.status === 'completed' || data.status === 'ready') {
        console.log('✅ Topic is ready!');
        setTopicStatus('ready');
        fetchTopicArticles(topicId);
      } else {
        console.log(`⏳ Topic still processing... Status: ${data.status}`);
      }
    } catch (error) {
      console.error('❌ Error checking topic status:', error);
    }
  };

  const fetchTopicArticles = async (topicId) => {
    try {
      const articles = await apiService.fetchTopicArticles(topicId);
      setArticles(articles);
    } catch (error) {
      console.error('❌ Error fetching articles:', error);
      setArticles([]);
    }
  };

  const handleFetchArticles = async () => {
    if (!searchQuery.trim()) return;

    console.log('🚀 Starting article fetch process...');
    setLoading(true);
    setIsSearchView(false);
    
    // Add initial user message
    setChatMessages([{ type: 'user', text: searchQuery }]);
    
    try {
      const data = await apiService.fetchTopicData(searchQuery, selectedSource);
      
      if (data.topic_id) {
        console.log(`🆔 Topic ID assigned: ${data.topic_id}`);
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
        console.error('❌ No topic_id in response:', data);
        throw new Error('Invalid response: missing topic_id');
      }
    } catch (error) {
      console.error('❌ Error in handleFetchArticles:', error);
      
      setChatMessages(prev => [...prev, {
        type: 'assistant',
        text: `Sorry, I encountered an error while fetching articles: ${error.message}. Please check the console for details.`,
        isError: true
      }]);
    } finally {
      setLoading(false);
      console.log('🏁 Article fetch process completed');
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !currentTopicId || topicStatus !== 'ready') {
      console.warn('⚠️ Cannot send message:', { 
        hasInput: !!chatInput.trim(), 
        topicId: currentTopicId, 
        topicStatus 
      });
      return;
    }

    const userMessage = chatInput;
    console.log('💬 Sending user message:', userMessage);
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
      console.error('❌ Error in handleSendMessage:', error);
      
      setChatMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
      setChatMessages(prev => [...prev, {
        type: 'assistant',
        text: `Sorry, I encountered an error while processing your question: ${error.message}. Please check the console for details.`,
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
      </div>
    </div>
  );
}