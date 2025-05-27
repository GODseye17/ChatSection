// app/components/chat/ChatMessageList.js
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

export default function ChatMessageList({ messages }) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div 
      ref={messagesContainerRef} 
      className="flex-1 overflow-y-auto px-4 py-8 chat-scrollbar relative z-10"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className="animate-in fade-in slide-in-from-bottom-3 duration-500"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <ChatMessage message={message} />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}