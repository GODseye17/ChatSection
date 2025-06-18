'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from './services/api';
import SearchView from './component/search/SearchView';
import ChatView from './component/chat/ChatView';
import Sidebar from './component/layout/Sidebar';
import Header from './component/layout/Header';
import SourcesCanvas from './component/canvas/SourcesCanvas';
import SystemStatus from './component/layout/SystemStatus';
import BetaActivation from './component/auth/BetaActivation';
import SessionWarning from './component/auth/SessionWarning';
import { AlertCircle, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { Badge } from './component/ui/badge';

export default function VivumApp() {
  // Beta activation state
  const [isActivated, setIsActivated] = useState(false);
  const [isCheckingActivation, setIsCheckingActivation] = useState(true);

  // System health
  const [systemHealth, setSystemHealth] = useState(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(true);

  // Main state
  const [isSearchView, setIsSearchView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({ model: true, supabase: true });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('pubmed');
  const [showFilters, setShowFilters] = useState(false);
  const [transformedQuery, setTransformedQuery] = useState(null);
  const [searchProgress, setSearchProgress] = useState(null);
  
  // Advanced search
  const [useMultiTopic, setUseMultiTopic] = useState(false);
  const [topics, setTopics] = useState(['', '']);
  const [operator, setOperator] = useState('AND');
  const [showSystemStatus, setShowSystemStatus] = useState(false);
  
  // Articles and RAG
  const [articles, setArticles] = useState([]);
  const [currentTopicId, setCurrentTopicId] = useState(null);
  const [topicStatus, setTopicStatus] = useState('idle');
  const [conversationId, setConversationId] = useState(null);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Refs for cleanup
  const cleanupTimeoutRef = useRef(null);
  const articlesUpdateRef = useRef(null);
  const fetchTimeoutRef = useRef(null);

  // ============================================
  // BETA ACTIVATION CHECK
  // ============================================

  useEffect(() => {
    const checkActivationStatus = () => {
      setIsCheckingActivation(true);
      
      // Check if user is already activated in current session
      const isActivated = sessionStorage.getItem('vivum_beta_activated');
      
      if (isActivated === 'true') {
        setIsActivated(true);
        // Initialize app after activation check
        initializeApp();
      } else {
        setIsActivated(false);
        setIsCheckingHealth(false); // Skip health check if not activated
      }
      
      setIsCheckingActivation(false);
    };

    checkActivationStatus();
  }, []);

  const handleActivationSuccess = () => {
    setIsActivated(true);
    // Initialize app after successful activation
    initializeApp();
  };

  // ============================================
  // INITIALIZATION
  // ============================================

  const initializeApp = async () => {
    await checkSystemHealth();
  };

  const checkSystemHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const health = await apiService.checkSystemHealth();

      setSystemHealth(health);
      setApiStatus({
        model: health.models,
        supabase: health.supabase
      });

    } catch (error) {
      console.error('Health check failed:', error);
      setApiStatus({ model: false, supabase: false });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  // ============================================
  // IMMEDIATE ARTICLES UPDATE FUNCTION
  // ============================================

  const updateArticlesImmediately = useCallback((newArticles) => {
    console.log('🚀 IMMEDIATE ARTICLES UPDATE:', newArticles.length, 'articles');
    
    // Clear any pending updates
    if (articlesUpdateRef.current) {
      clearTimeout(articlesUpdateRef.current);
    }
    
    // Validate articles structure
    const validArticles = newArticles.filter(article => {
      return article && (article.title || article.abstract || article.pmid || article.doi);
    });
    
    console.log(`✅ Validated ${validArticles.length} articles from ${newArticles.length} total`);
    
    // Force immediate state update with new array reference
    setArticles([...validArticles]);
    
    // Force re-render verification
    articlesUpdateRef.current = setTimeout(() => {
      setArticles(prev => {
        if (prev.length !== validArticles.length) {
          console.log('⚠️ Articles state mismatch detected, forcing correction');
          return [...validArticles];
        }
        console.log('✅ Articles state verified:', prev.length, 'articles in state');
        return prev;
      });
    }, 100);
    
    return validArticles.length;
  }, []);

  // ============================================
  // SEARCH AND FETCH ARTICLES
  // ============================================

  const handleFetchArticles = async (options = {}) => {
    if (!options || typeof options !== 'object') {
      options = {};
    }

    // Handle filters
    const filters = options.advanced_query === undefined ? options : null;
    const isAdvancedQuery = options && options.advanced_query !== undefined;
    
    if (!isAdvancedQuery && !searchQuery.trim() && !useMultiTopic) return;

    setLoading(true);
    setSearchProgress({ status: 'initiating', message: 'Starting search...' });
    
    // Clear previous data IMMEDIATELY
    setChatMessages([]);
    setConversationId(null);
    updateArticlesImmediately([]); // Clear articles immediately
    setTopicStatus('processing');
    apiService.currentConversationId = null;

    try {
      // Transform query if single topic search
      let queryTransformation = null;
      if (!useMultiTopic && searchQuery && !isAdvancedQuery) {
        queryTransformation = await apiService.transformQuery(searchQuery);
        setTransformedQuery(queryTransformation);
        
        // Show transformation briefly
        if (queryTransformation.is_transformed) {
          setSearchProgress({
            status: 'transforming',
            message: 'Query optimized for medical search'
          });
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Prepare fetch options
      const fetchOptions = {
        max_results: 20,
        create_embeddings: true,
        auto_transform: true,
        filters: filters,
        onStatusUpdate: (progress) => {
          setSearchProgress(progress);
          
          // Update topic status
          if (progress.status === 'completed') {
            setTopicStatus('ready');
          } else if (progress.status.startsWith('error')) {
            setTopicStatus('error');
          } else {
            setTopicStatus('processing');
          }
        }
      };

      // Handle different search types
      if (isAdvancedQuery) {
        fetchOptions.advanced_query = options.advanced_query;
      } else if (useMultiTopic) {
        const validTopics = topics.filter(t => t.trim());
        if (validTopics.length === 0) {
          throw new Error('Please enter at least one topic');
        }
        fetchOptions.topics = validTopics;
        fetchOptions.operator = operator;
      } else {
        fetchOptions.topic = searchQuery;
      }

      // Fetch articles
      console.log('🔍 Starting article fetch with options:', fetchOptions);
      const result = await apiService.fetchArticles(fetchOptions);
      setCurrentTopicId(result.topicId);
      apiService.currentTopicId = result.topicId;

      console.log('🎯 Fetch completed, topic ID:', result.topicId);

      // Start aggressive article fetching with timeout protection
      const startTime = Date.now();
      let articlesData = null;
      let retries = 0;
      const maxRetries = 15; // Increased retries
      const maxWaitTime = 120000; // 2 minutes max total wait
      
      // Clear any existing fetch timeout
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      
      // Set overall timeout
      const fetchPromise = new Promise(async (resolve, reject) => {
        fetchTimeoutRef.current = setTimeout(() => {
          reject(new Error('Article fetch timeout after 2 minutes'));
        }, maxWaitTime);
        
        // Start fetching articles immediately
        while (retries < maxRetries) {
          try {
            const elapsed = Date.now() - startTime;
            console.log(`📚 Fetching articles attempt ${retries + 1} (${elapsed}ms elapsed)`);
            
            articlesData = await apiService.getArticles(result.topicId);
            console.log(`📊 Articles fetch result:`, articlesData);
            
            if (articlesData && articlesData.articles && articlesData.articles.length > 0) {
              console.log('✅ Successfully fetched articles:', articlesData.articles.length);
              
              // Clear timeout on success
              if (fetchTimeoutRef.current) {
                clearTimeout(fetchTimeoutRef.current);
              }
              
              resolve(articlesData);
              return;
            }
            
            // Progressive wait times: 500ms, 1s, 2s, 3s, 4s, 5s, then 5s max
            const waitTime = Math.min(500 + (retries * 1000), 5000);
            console.log(`⏳ No articles found, retrying in ${waitTime}ms... (attempt ${retries + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            retries++;
          } catch (error) {
            console.error(`❌ Articles fetch error on attempt ${retries + 1}:`, error);
            retries++;
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        // If we get here, all retries failed
        resolve({ articles: [] });
      });
      
      // Wait for articles with timeout protection
      articlesData = await fetchPromise;
      
      // Extract articles from the response
      const fetchedArticles = articlesData?.articles || [];
      console.log('📋 Final articles count:', fetchedArticles.length);
      
      // UPDATE ARTICLES IMMEDIATELY - This is critical!
      const actualCount = updateArticlesImmediately(fetchedArticles);
      console.log(`🎯 Articles state updated with ${actualCount} articles`);
      
      // Update conversation history
      const searchTopic = isAdvancedQuery && options.advanced_query
        ? options.advanced_query 
        : (useMultiTopic ? topics.filter(t => t.trim()).join(` ${operator} `) : searchQuery);
        
      setConversationHistory(prev => [{
        topic: searchTopic,
        source: selectedSource,
        timestamp: new Date(),
        topicId: result.topicId,
        articleCount: actualCount
      }, ...prev.slice(0, 9)]);

      // Switch to chat view
      setIsSearchView(false);
      setTopicStatus('ready');
      
      // Show success message with correct article count
      if (actualCount > 0) {
        setChatMessages([{
          type: 'system',
          text: `Found ${actualCount} articles and created embeddings. You can now ask questions about the research!`,
          timestamp: new Date()
        }]);
      } else {
        // Handle case where no articles were found
        setChatMessages([{
          type: 'system',
          text: 'Search completed but no articles were found. Try adjusting your search terms or filters.',
          timestamp: new Date(),
          isError: false
        }]);
        
        // Log for debugging
        console.warn('⚠️ No articles returned from API for topic:', result.topicId);
        console.log('API response was:', articlesData);
      }

      // Schedule cleanup
      scheduleCleanup(result.topicId);

    } catch (error) {
      console.error('❌ Fetch error:', error);
      setTopicStatus('error');
      setChatMessages([{
        type: 'system',
        text: `Error: ${error.message}`,
        timestamp: new Date(),
        isError: true
      }]);
      setIsSearchView(false);
    } finally {
      setLoading(false);
      setSearchProgress(null);
      
      // Clear fetch timeout
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    }
  };

  // ============================================
  // CHAT
  // ============================================

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      type: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Add loading message
    const loadingMessage = {
      type: 'assistant',
      text: articles.length > 0 
        ? `Analyzing ${articles.length} research papers...` 
        : 'Processing your question...',
      timestamp: new Date(),
      isLoading: true,
      id: Date.now()
    };
    setChatMessages(prev => [...prev, loadingMessage]);

    try {
      console.log('🤖 Sending query with:', {
        question: chatInput,
        topicId: currentTopicId,
        conversationId: conversationId,
        articlesCount: articles.length
      });

      const response = await apiService.query(
        chatInput, 
        currentTopicId, 
        conversationId
      );

      console.log('🤖 Query response:', response);

      // Update conversation ID
      if (response.conversation_id && !conversationId) {
        setConversationId(response.conversation_id);
      }

      // Replace loading message with response
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id
            ? {
                type: 'assistant',
                text: response.response,
                timestamp: new Date(),
                citations: response.citations,
                context: response.context,
                sources_used: response.sources_used || articles.length
              }
            : msg
        )
      );

    } catch (error) {
      console.error('Query error:', error);
      // Replace loading message with error
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id
            ? {
                type: 'assistant',
                text: `I encountered an error: ${error.message}. Please try again.`,
                timestamp: new Date(),
                isError: true
              }
            : msg
        )
      );
    }
  };

  // ============================================
  // CLEANUP
  // ============================================

  const scheduleCleanup = (topicId) => {
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
    }

    // Schedule cleanup after 1 hour
    cleanupTimeoutRef.current = setTimeout(async () => {
      try {
        await apiService.cleanupTopic(topicId);
        console.log(`Cleaned up topic ${topicId} after inactivity`);
      } catch (error) {
        console.error('Auto cleanup failed:', error);
      }
    }, 60 * 60 * 1000); // 1 hour
  };

  // Cleanup on unmount
  useEffect(() => {
    // Add debug functions to window for testing
    if (process.env.NODE_ENV === 'development') {
      window.debugVivum = {
        articles,
        topicId: currentTopicId,
        refreshArticles: async () => {
          if (!currentTopicId) {
            console.log('No topic ID set');
            return;
          }
          console.log('Manually fetching articles for topic:', currentTopicId);
          try {
            const data = await apiService.getArticles(currentTopicId);
            console.log('Manual fetch result:', data);
            updateArticlesImmediately(data.articles || []);
            return data;
          } catch (error) {
            console.error('Manual fetch failed:', error);
          }
        },
        forceSetArticles: (count = 5) => {
          const mockArticles = Array.from({ length: count }, (_, i) => ({
            id: i,
            title: `Mock Article ${i + 1}`,
            abstract: `This is a mock article for testing purposes.`,
            authors: [`Author ${i + 1}`],
            journal: 'Test Journal',
            doi: `10.1000/test.${i + 1}`,
            pmid: `${12345678 + i}`
          }));
          console.log('Setting mock articles:', mockArticles);
          updateArticlesImmediately(mockArticles);
        },
        getArticlesState: () => {
          console.log('Current articles state:', articles);
          return articles;
        },
        clearArticles: () => {
          console.log('Clearing articles');
          updateArticlesImmediately([]);
        },
        testQuery: async (question = "What are the main findings?") => {
          if (!currentTopicId) {
            console.log('No topic ID set');
            return;
          }
          try {
            const response = await apiService.query(question, currentTopicId);
            console.log('Test query response:', response);
            return response;
          } catch (error) {
            console.error('Test query failed:', error);
          }
        }
      };
    }

    return () => {
      apiService.stopMonitoring();
      
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      
      if (articlesUpdateRef.current) {
        clearTimeout(articlesUpdateRef.current);
      }
      
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      
      // Clean up debug
      if (window.debugVivum) {
        delete window.debugVivum;
      }
    };
  }, [articles, currentTopicId, updateArticlesImmediately]);

  // ============================================
  // UI HELPERS
  // ============================================

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const onSelectConversation = async (conversation) => {
    setCurrentTopicId(conversation.topicId);
    apiService.currentTopicId = conversation.topicId;
    setSearchQuery(conversation.topic);
    setIsSearchView(false);
    setTopicStatus('processing');
    
    // Load articles
    try {
      const data = await apiService.getArticles(conversation.topicId);
      console.log('Loaded articles for conversation:', data);
      updateArticlesImmediately(data.articles || []);
      setTopicStatus('ready');
    } catch (error) {
      console.error('Failed to load articles:', error);
      setTopicStatus('error');
    }
  };

  // ============================================
  // RENDER
  // ============================================

  // Show beta activation if not activated
  if (isCheckingActivation) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Checking activation status...</p>
        </div>
      </div>
    );
  }

  if (!isActivated) {
    return <BetaActivation onActivationSuccess={handleActivationSuccess} />;
  }

  // Show loading while checking health after activation
  if (isCheckingHealth) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Initializing Vivum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {/* Session Warning */}
        <SessionWarning />

        {/* System Status Bar */}
        {systemHealth && (!systemHealth.server || !systemHealth.database || !systemHealth.models) && (
          <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">System Status:</span>
                <Badge variant={systemHealth.server ? "default" : "destructive"} className="text-xs">
                  Server: {systemHealth.server ? '✓' : '✗'}
                </Badge>
                <Badge variant={systemHealth.database ? "default" : "destructive"} className="text-xs">
                  DB: {systemHealth.database ? '✓' : '✗'}
                </Badge>
                <Badge variant={systemHealth.models ? "default" : "destructive"} className="text-xs">
                  AI: {systemHealth.models ? '✓' : '✗'}
                </Badge>
              </div>
              <button
                onClick={() => setShowSystemStatus(true)}
                className="text-xs text-yellow-500 hover:text-yellow-400"
              >
                Details
              </button>
            </div>
          </div>
        )}

        <Sidebar
          sidebarOpen={sidebarOpen}
          conversationHistory={conversationHistory}
          onSelectConversation={onSelectConversation}
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
            onShowSystemStatus={() => setShowSystemStatus(true)}
          />

          <main className="h-[calc(100vh-4rem)]">
            {isSearchView ? (
              <>
                <SearchView
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedSource={selectedSource}
                  setSelectedSource={setSelectedSource}
                  handleFetchArticles={handleFetchArticles}
                  loading={loading}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  // Multi-topic search
                  useMultiTopic={useMultiTopic}
                  setUseMultiTopic={setUseMultiTopic}
                  topics={topics}
                  setTopics={setTopics}
                  operator={operator}
                  setOperator={setOperator}
                />
                
                {/* Search Progress */}
                {searchProgress && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-800 shadow-2xl">
                      <div className="text-center">
                        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                          <div className="absolute inset-0 bg-purple-600/20 rounded-full animate-ping"></div>
                          <div className="relative bg-gradient-to-br from-purple-600 to-purple-700 rounded-full p-4">
                            <Loader2 className="w-12 h-12 text-white animate-spin" />
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-semibold mb-2 text-gray-100">Processing Research</h3>
                        <p className="text-gray-400 mb-6">{searchProgress.message}</p>
                        
                        {/* Progress bar */}
                        {searchProgress.attempts && searchProgress.maxAttempts && (
                          <div className="mb-6">
                            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-purple-600 to-purple-500 h-full rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${(searchProgress.attempts / searchProgress.maxAttempts) * 100}%` 
                                }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Step {searchProgress.attempts} of {searchProgress.maxAttempts}
                            </p>
                          </div>
                        )}
                        
                        {/* Query transformation */}
                        {transformedQuery && transformedQuery.is_transformed && (
                          <div className="mb-6 p-4 bg-purple-600/10 rounded-xl border border-purple-600/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-purple-400" />
                              <p className="text-sm font-medium text-purple-300">Query Optimized</p>
                            </div>
                            <p className="text-sm text-purple-200 italic">For medical search</p>
                          </div>
                        )}
                        
                        <button
                          onClick={() => {
                            apiService.stopMonitoring();
                            setSearchProgress(null);
                            setLoading(false);
                          }}
                          className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <ChatView
                chatMessages={chatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                handleSendMessage={handleSendMessage}
                topicStatus={topicStatus}
                setIsSearchView={setIsSearchView}
                sidebarOpen={sidebarOpen}
                currentTopic={searchQuery || (useMultiTopic ? topics.filter(t => t.trim()).join(` ${operator} `) : '')}
                articles={articles} // Pass articles to ChatView
              />
            )}
          </main>

          <SourcesCanvas
            articles={articles}
            isOpen={showSources}
            onClose={() => setShowSources(false)}
          />

          <SystemStatus 
            isOpen={showSystemStatus}
            onClose={() => setShowSystemStatus(false)}
          />
        </div>
      </div>
    </div>
  );
}