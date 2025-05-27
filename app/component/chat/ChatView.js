// app/components/chat/ChatView.js
import React, { useEffect } from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { PlusCircle } from 'lucide-react';

export default function ChatView({ 
  chatMessages, 
  chatInput, 
  setChatInput, 
  handleSendMessage, 
  topicStatus,
  setIsSearchView 
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
    <div className="flex flex-col h-[calc(100vh-4rem)] relative bg-[#0a0a0a]">
      <div className="animated-bg opacity-20">
        <div className="grid-pattern"></div>
        <div className="particles chat-particles"></div>
        <div className="gradient-layer"></div>
      </div>
      
      <div className="flex-1 relative z-10 flex flex-col">
        <ChatMessageList messages={chatMessages} />
        
        <div className="border-t border-gray-800 bg-gradient-to-b from-transparent to-gray-900/50 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <ChatInput
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleSendMessage={handleSendMessage}
              topicStatus={topicStatus}
            />
            
            <button
              onClick={() => setIsSearchView(true)}
              className="mt-4 mx-auto flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg"
            >
              <PlusCircle className="w-4 h-4" />
              New Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}