// app/components/chat/ChatMessage.js
import React, { useState, useEffect } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessage({ message }) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (message.type === 'assistant' && !message.isLoading) {
      setIsTyping(true);
      let currentText = '';
      const text = message.text;
      let index = 0;

      const typeWriter = () => {
        if (index < text.length) {
          currentText += text.charAt(index);
          setDisplayText(currentText);
          index++;
          setTimeout(typeWriter, 20);
        } else {
          setIsTyping(false);
        }
      };

      typeWriter();
    } else {
      setDisplayText(message.text);
    }
  }, [message.text, message.type, message.isLoading]);

  if (message.isInitialLoad && !message.isLoading) return null;

  if (message.isLoading) {
    return (
      <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom duration-300">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm">
          V
        </div>
        <div className="flex-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-2xl text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            {message.text}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 ${message.type === 'user' ? 'justify-end' : ''} animate-in fade-in slide-in-from-bottom duration-300`}>
      {message.type === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm">
          V
        </div>
      )}
      
      <div className={`flex-1 max-w-2xl ${message.type === 'user' ? 'order-1' : ''}`}>
        <div className={`inline-block px-4 py-2 rounded-2xl ${
          message.type === 'user' 
            ? 'bg-purple-600 text-white' 
            : message.isError
            ? 'bg-red-50 text-red-600'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {message.type === 'assistant' ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {isTyping ? displayText : message.text}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm">{message.text}</p>
          )}
        </div>
        
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            {message.citations.map((citation, cidx) => (
              <a 
                key={cidx}
                href={`https://doi.org/${citation.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-purple-600"
              >
                {citation.title}
              </a>
            ))}
          </div>
        )}
      </div>
      
      {message.type === 'user' && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
          U
        </div>
      )}
    </div>
  );
}