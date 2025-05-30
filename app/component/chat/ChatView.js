// app/component/chat/ChatView.js
import React, { useEffect, useState } from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Bot } from 'lucide-react';

export default function ChatView({
  chatMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
  topicStatus,
  setIsSearchView,
  sidebarOpen,
  searchQuery,
  articles
}) {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] relative bg-gray-950 transition-all duration-300 ${
      sidebarOpen ? 'ml-80' : 'ml-0'
    }`}>
      {/* Header Section */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchView(true)}
                className="text-gray-400 hover:text-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-500" />
                  Research Assistant
                </h2>
                <p className="text-sm text-gray-400 truncate max-w-md">
                  {searchQuery || 'AI-powered research analysis'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {articles && articles.length > 0 && (
                <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-gray-700">
                  <FileText className="h-3 w-3 mr-1" />
                  {articles.length} articles
                </Badge>
              )}
              <Badge 
                variant="outline" 
                className={`
                  ${topicStatus === 'ready' 
                    ? 'border-green-500 text-green-500' 
                    : topicStatus === 'processing'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-gray-500 text-gray-500'
                  }
                `}
              >
                {topicStatus === 'ready' ? 'Ready' : 
                 topicStatus === 'processing' ? 'Processing...' : 'Idle'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <Card className="flex-1 m-4 border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden">
        <ScrollArea className="h-full">
          <ChatMessageList messages={chatMessages} />
        </ScrollArea>
      </Card>
      
      {/* Input Area */}
      <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSendMessage={handleSendMessage}
            topicStatus={topicStatus}
            setIsSearchView={setIsSearchView}
            onTyping={setIsTyping}
          />
        </div>
      </div>
    </div>
  );
}