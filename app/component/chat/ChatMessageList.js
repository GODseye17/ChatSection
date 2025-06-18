// app/component/chat/ChatMessageList.js
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { ArrowDown } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { cn } from '@/app/lib/utils';

export default function ChatMessageList({ messages }) {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isAtBottom);
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;

    messages.forEach((message, idx) => {
      const messageDate = new Date(message.timestamp || Date.now()).toDateString();
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({
          type: 'date',
          date: messageDate,
          isToday: messageDate === new Date().toDateString(),
          id: `date-${messageDate}-${idx}`
        });
      }
      
      groups.push({ ...message, idx, id: message.id || `msg-${idx}` });
    });

    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="relative h-full flex flex-col">
      {/* Messages container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(75 85 99) transparent'
        }}
      >
        <div className="pb-8">
          {groupedMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center space-y-2">
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-600">Ask a question about the research</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 px-4 pb-4 pt-8">
              {groupedMessages.map((item) => {
                if (item.type === 'date') {
                  return (
                    <div key={item.id} className="flex items-center gap-4 my-8">
                      <div className="flex-1 h-px bg-gray-800" />
                      <span className="text-xs text-gray-500 px-2">
                        {item.isToday ? 'Today' : item.date}
                      </span>
                      <div className="flex-1 h-px bg-gray-800" />
                    </div>
                  );
                }
                
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "transition-all duration-300",
                      "animate-in fade-in slide-in-from-bottom-3"
                    )}
                    style={{
                      animationDelay: `${Math.min(item.idx * 50, 300)}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <ChatMessage message={item} />
                  </div>
                );
              })}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          )}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        
        div::-webkit-scrollbar-thumb {
          background: rgb(75 85 99);
          border-radius: 3px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: rgb(107 114 128);
        }
      `}</style>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          className="absolute bottom-4 right-4 rounded-full shadow-lg bg-gray-800 hover:bg-gray-700 z-10"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}