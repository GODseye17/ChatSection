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
      {/* Messages container - responsive scrollbar */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(75 85 99) transparent'
        }}
      >
        <div className="pb-6 sm:pb-8">
          {groupedMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[400px] px-4">
              <div className="text-center space-y-2">
                <p className="text-gray-500 text-sm sm:text-base">No messages yet</p>
                <p className="text-xs sm:text-sm text-gray-600">Ask a question about the research</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 pb-4 pt-6 sm:pt-8">
              {groupedMessages.map((item) => {
                if (item.type === 'date') {
                  return (
                    <div key={item.id} className="flex items-center gap-3 sm:gap-4 my-6 sm:my-8 px-4">
                      <div className="flex-1 h-px bg-gray-800" />
                      <span className="text-xs text-gray-500 px-2 whitespace-nowrap">
                        {item.isToday ? 'Today' : new Date(item.date).toLocaleDateString()}
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

      {/* Custom scrollbar styles - responsive */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 4px;
        }
        
        @media (min-width: 640px) {
          div::-webkit-scrollbar {
            width: 6px;
          }
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

      {/* Scroll to bottom button - responsive positioning */}
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-lg bg-gray-800 hover:bg-gray-700 z-10"
        >
          <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      )}
    </div>
  );
}