// app/components/chat/ChatView.js
import React, { useEffect, useState } from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';

export default function ChatView({ 
  chatMessages, 
  chatInput, 
  setChatInput, 
  handleSendMessage, 
  topicStatus,
  setIsSearchView,
  setShowSources,
  sidebarOpen 
}) {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div 
      className={`flex flex-col h-[calc(100vh-4rem)] relative transition-all duration-300 ${
        sidebarOpen ? 'ml-80' : 'ml-0'
      }`}
      style={{
        background: 'linear-gradient(to bottom, rgba(17, 24, 39, 0.95), rgba(0, 0, 0, 0.95))',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover'
      }}
    >
      <div className="animated-bg fixed inset-0 pointer-events-none">
        <div className="grid-pattern"></div>
        <div className="particles"></div>
        <div className="matrix-rain"></div>
        <div className="neural-lines"></div>
        <div className="energy-waves"></div>
        <div className="holographic"></div>
        <div className="circuit-pattern"></div>
        <div className="dna-helix"></div>
        <div className="gradient-layer"></div>
        <div className="network-dots"></div>
        <div className="network-lines"></div>
      </div>
      
      <div className="flex-1 relative z-10 flex flex-col">
        <div className="flex-1 flex">
          <div className="flex-1 max-w-[85rem] mx-auto w-full px-4 md:px-8">
            <ChatMessageList messages={chatMessages} />
          </div>
        </div>
        
        <ChatInput
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleSendMessage={handleSendMessage}
          topicStatus={topicStatus}
          setIsSearchView={setIsSearchView}
          setShowSources={setShowSources}
          onTyping={setIsTyping}
        />
      </div>
    </div>
  );
}