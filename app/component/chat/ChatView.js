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
  sidebarOpen 
}) {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Create particles for chat background
    const createParticles = () => {
      const particlesContainer = document.querySelector('.chat-particles');
      if (!particlesContainer) return;

      // Clear existing particles
      particlesContainer.innerHTML = '';

      // Create new particles
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particlesContainer.appendChild(particle);
      }
    };

    createParticles();
  }, []);

  // Update particle animation when typing
  useEffect(() => {
    const particlesContainer = document.querySelector('.chat-particles');
    if (particlesContainer) {
      if (isTyping) {
        particlesContainer.classList.add('active');
      } else {
        particlesContainer.classList.remove('active');
      }
    }
  }, [isTyping]);

  return (
    <div className={`flex flex-col h-[calc(100vh-4rem)] relative bg-gray-900 transition-all duration-300 ${
      sidebarOpen ? 'ml-80' : 'ml-0'
    }`}>
      <div className="animated-bg">
        <div className="grid-pattern"></div>
        <div className="particles chat-particles"></div>
        <div className="gradient-layer"></div>
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
          onTyping={setIsTyping}
        />
      </div>
    </div>
  );
}