// app/component/chat/ChatView.js
import React, { useEffect, useState } from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import { cn } from '@/app/lib/utils';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Brain, Sparkles, BookOpen, MessageSquare, ArrowLeft } from 'lucide-react';

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
    // Create enhanced particles for chat background
    const createParticles = () => {
      const particlesContainer = document.querySelector('.chat-particles');
      if (!particlesContainer) return;

      particlesContainer.innerHTML = '';

      // Create more diverse particles
      for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 30}s`;
        particle.style.animationDuration = `${20 + Math.random() * 40}s`;
        
        // Add size variation
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
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
      {/* Enhanced animated background */}
      <div className="fixed inset-0 z-0 animated-bg pointer-events-none">
        <div className="grid-pattern opacity-30"></div>
        <div className="particles chat-particles"></div>
        <div className="energy-waves"></div>
        <div className="holographic"></div>
        <div className="gradient-layer"></div>
        {/* Additional gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-transparent to-blue-950/20"></div>
      </div>

      {/* Chat header with topic info */}
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
                <span className="text-sm text-gray-300 font-medium">Research Topic:</span>
                <span className="text-sm text-gray-100 max-w-xs truncate">{currentTopic}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5 border-purple-600/30 text-purple-400">
                <Sparkles className="w-3 h-3" />
                AI Analysis Active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Chat content area */}
      <div className="h-[calc(100vh-8rem)] flex flex-col relative z-10">
        {/* Welcome card for empty chat */}
        {chatMessages.length === 0 && topicStatus === 'ready' && (
          <div className="flex-1 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full p-8 bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/10 rounded-2xl border border-purple-600/20">
                  <MessageSquare className="w-8 h-8 text-purple-400" />
                </div>
                
                <h2 className="text-2xl font-semibold text-gray-100">
                  Ready to analyze your research
                </h2>
                
                <p className="text-gray-400 max-w-md mx-auto">
                  I've processed the articles and I'm ready to answer your questions. Ask me anything about the research findings, methodologies, or conclusions.
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("What are the key findings?")}
                    className="text-xs"
                  >
                    What are the key findings?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("Summarize the methodology")}
                    className="text-xs"
                  >
                    Summarize the methodology
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("What are the limitations?")}
                    className="text-xs"
                  >
                    What are the limitations?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatInput("Compare the different studies")}
                    className="text-xs"
                  >
                    Compare the studies
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Messages area */}
        {chatMessages.length > 0 && (
          <div className="flex-1 overflow-hidden">
            <ChatMessageList messages={chatMessages} />
          </div>
        )}
        
        {/* Input area */}
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