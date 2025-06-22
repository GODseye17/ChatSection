// app/component/chat/ChatView.js
import React, { useEffect, useState } from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { cn } from '@/app/lib/utils';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Brain, Sparkles, MessageSquare, ArrowLeft, BookOpen, Menu } from 'lucide-react';

export default function ChatView({
  chatMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
  topicStatus,
  setIsSearchView,
  sidebarOpen,
  setSidebarOpen,
  currentTopic,
  articles = []
}) {
  const [isTyping, setIsTyping] = useState(false);

  // Debug log for articles
  console.log('ChatView - Articles received:', articles?.length || 0);

  return (
    <>
      {/* Enhanced animated background */}
      <div className="fixed inset-0 z-0 animated-bg pointer-events-none">
        <div className="grid-pattern opacity-30"></div>
        <div className="particles chat-particles"></div>
        <div className="energy-waves"></div>
        <div className="gradient-layer"></div>
      </div>

      {/* Chat header - Responsive */}
      <div className="relative z-10 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="w-full px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Left section - Mobile optimized */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen?.(!sidebarOpen)}
                className="sm:hidden gap-2 flex-shrink-0"
              >
                <Menu className="w-4 h-4" />
              </Button>
              
              {/* Back button - responsive text */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchView(true)}
                className="gap-2 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Search</span>
                <span className="sm:hidden">Back</span>
              </Button>
              
              {/* Divider - hidden on mobile */}
              <div className="h-4 w-px bg-gray-700 hidden sm:block flex-shrink-0"></div>
              
              {/* Topic info - responsive */}
              <div className="flex items-center gap-2 min-w-0">
                <Brain className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-300 font-medium hidden sm:inline flex-shrink-0">Topic:</span>
                <span className="text-xs sm:text-sm text-gray-100 truncate min-w-0">{currentTopic}</span>
              </div>
            </div>
            
            {/* Right section - Responsive */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Articles count indicator - responsive */}
              {articles && articles.length > 0 && (
                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-purple-600/10 rounded-full border border-purple-600/20">
                  <BookOpen className="w-3 h-3 text-purple-400 flex-shrink-0" />
                  <span className="text-xs text-purple-300 font-medium whitespace-nowrap">
                    <span className="hidden sm:inline">{articles.length} article{articles.length !== 1 ? 's' : ''} loaded</span>
                    <span className="sm:hidden">{articles.length}</span>
                  </span>
                </div>
              )}
              
              {/* AI badge - responsive */}
              <Badge variant="outline" className="gap-1 sm:gap-1.5 border-purple-600/30 text-purple-400 text-xs">
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">AI Analysis Active</span>
                <span className="sm:hidden">AI</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Chat content area - Responsive padding and height */}
      <div className="h-[calc(100vh-8rem)] sm:h-[calc(100vh-8rem)] relative z-10 pb-20 sm:pb-24 lg:pb-32">
        {/* Welcome card for empty chat - Responsive */}
        {chatMessages.length === 0 && topicStatus === 'ready' && (
          <div className="flex items-center justify-center h-full p-3 sm:p-4 lg:p-6">
            <Card className="max-w-xs sm:max-w-md lg:max-w-2xl w-full p-4 sm:p-6 lg:p-8 bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-purple-600/10 rounded-xl sm:rounded-2xl border border-purple-600/20">
                  <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-400" />
                </div>
                
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-100">
                  Ready to analyze your research
                </h2>
                
                <p className="text-sm sm:text-base text-gray-400 max-w-md mx-auto leading-relaxed">
                  {articles && articles.length > 0 
                    ? `I've processed ${articles.length} articles and I'm ready to answer your questions. Ask me anything about the research findings, methodologies, or conclusions.`
                    : "I'm ready to answer your questions. You can ask about research topics even without specific articles loaded."
                  }
                </p>

                {/* Show article count if available - Responsive */}
                {articles && articles.length > 0 && (
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4 text-green-400" />
                      <span className="text-xs sm:text-sm text-green-300 font-medium">
                        {articles.length} research article{articles.length !== 1 ? 's' : ''} ready for analysis
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
        
        {/* Messages area - Responsive */}
        {chatMessages.length > 0 && (
          <div className="h-full overflow-hidden">
            <ChatMessageList messages={chatMessages} />
          </div>
        )}
      </div>
      
      {/* Floating input - Responsive */}
      <ChatInput
        chatInput={chatInput}
        setChatInput={setChatInput}
        handleSendMessage={handleSendMessage}
        topicStatus={topicStatus}
        setIsSearchView={setIsSearchView}
        onTyping={setIsTyping}
      />
    </>
  );
}