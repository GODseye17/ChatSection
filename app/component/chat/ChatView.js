// app/component/chat/ChatView.js
import React, { useEffect, useState } from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { cn } from '@/app/lib/utils';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Brain, Sparkles, MessageSquare, ArrowLeft, BookOpen } from 'lucide-react';

export default function ChatView({
  chatMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
  topicStatus,
  setIsSearchView,
  sidebarOpen,
  currentTopic,
  articles = [] // Add articles prop with default
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

      {/* Chat header */}
      <div className="relative z-10 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchView(true)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </Button>
              
              <div className="h-4 w-px bg-gray-700"></div>
              
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300 font-medium">Topic:</span>
                <span className="text-sm text-gray-100 max-w-xs truncate">{currentTopic}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Articles count indicator */}
              {articles && articles.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/10 rounded-full border border-purple-600/20">
                  <BookOpen className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium">
                    {articles.length} article{articles.length !== 1 ? 's' : ''} loaded
                  </span>
                </div>
              )}
              
              <Badge variant="outline" className="gap-1.5 border-purple-600/30 text-purple-400">
                <Sparkles className="w-3 h-3" />
                AI Analysis Active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Chat content area - with padding bottom for floating input */}
      <div className="h-[calc(100vh-8rem)] relative z-10 pb-32">
        {/* Welcome card for empty chat */}
        {chatMessages.length === 0 && topicStatus === 'ready' && (
          <div className="flex items-center justify-center h-full p-4">
            <Card className="max-w-2xl w-full p-8 bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/10 rounded-2xl border border-purple-600/20">
                  <MessageSquare className="w-8 h-8 text-purple-400" />
                </div>
                
                <h2 className="text-2xl font-semibold text-gray-100">
                  Ready to analyze your research
                </h2>
                
                <p className="text-gray-400 max-w-md mx-auto">
                  {articles && articles.length > 0 
                    ? `I've processed ${articles.length} articles and I'm ready to answer your questions. Ask me anything about the research findings, methodologies, or conclusions.`
                    : "I'm ready to answer your questions. You can ask about research topics even without specific articles loaded."
                  }
                </p>

                {/* Show article count if available */}
                {articles && articles.length > 0 && (
                  <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-300 font-medium">
                        {articles.length} research articles ready for analysis
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
        
        {/* Messages area */}
        {chatMessages.length > 0 && (
          <div className="h-full overflow-hidden">
            <ChatMessageList messages={chatMessages} />
          </div>
        )}
      </div>
      
      {/* Floating input */}
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