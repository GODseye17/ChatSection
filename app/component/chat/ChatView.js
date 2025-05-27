// app/components/chat/ChatView.js
import React, { useEffect } from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';

export default function ChatView({ 
  chatMessages, 
  chatInput, 
  setChatInput, 
  handleSendMessage, 
  topicStatus 
}) {
  useEffect(() => {
    const createParticles = () => {
      const particlesContainer = document.querySelector('.chat-particles');
      if (!particlesContainer) return;

      particlesContainer.innerHTML = '';

      for (let i = 0; i < 30; i++) {
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

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] relative">
      <div className="animated-bg fixed inset-0 opacity-30 pointer-events-none">
        <div className="grid-pattern"></div>
        <div className="particles chat-particles"></div>
        <div className="gradient-layer"></div>
      </div>
      
      <ChatMessageList messages={chatMessages} />
      <ChatInput
        chatInput={chatInput}
        setChatInput={setChatInput}
        handleSendMessage={handleSendMessage}
        topicStatus={topicStatus}
      />
    </div>
  );
}