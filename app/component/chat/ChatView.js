// app/component/chat/ChatView.js
import React, { useEffect, useState } from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { cn } from '@/app/lib/utils';

export default function ChatView({
  chatMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
  topicStatus,
  setIsSearchView,
  sidebarOpen,
  currentTopic
}) {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Create particles for chat background
    const createParticles = () => {
      const particlesContainer = document.querySelector('.chat-particles');
      if (!particlesContainer) return;

      // Clear existing particles
      particlesContainer.innerHTML = '';

      // Create new particles - more particles for full coverage
      for (let i = 0; i < 80; i++) {
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
    <>
      {/* Full-screen animated background */}
      <div className="fixed inset-0 z-0 animated-bg pointer-events-none">
        <div className="grid-pattern"></div>
        <div className="particles chat-particles"></div>
        <div className="energy-waves"></div>
        <div className="holographic"></div>
        <div className="gradient-layer"></div>
      </div>

      {/* Chat content area - Full height with proper flex layout */}
      <div className="h-full flex flex-col relative z-10">
        {/* Messages area - Takes up all available space */}
        <div className="flex-1 overflow-hidden">
          <ChatMessageList messages={chatMessages} />
        </div>
        
        {/* Input area - Auto height at bottom */}
        <ChatInput
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleSendMessage={handleSendMessage}
          topicStatus={topicStatus}
          setIsSearchView={setIsSearchView}
          onTyping={setIsTyping}
        />
      </div>
    </>
  );
}