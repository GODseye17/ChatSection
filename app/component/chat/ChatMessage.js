// app/component/chat/ChatMessage.js
import React, { useState, useEffect } from 'react';
import { Loader2, ExternalLink, Copy, Check, User, Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { cn } from '@/app/lib/utils';

// Function to convert PubMed IDs to links
const processPubMedLinks = (text) => {
  let processedText = text;
  
  // Replace PMID references in various formats
  processedText = processedText.replace(/(?:PubMed ID|PMID|pmid):\s*(\d{7,9})/gi, (match, id) => {
    return `[PMID: ${id}](https://pubmed.ncbi.nlm.nih.gov/${id}/)`;
  });
  
  // Replace standalone PMIDs in parentheses
  processedText = processedText.replace(/\(PMID:\s*(\d{7,9})\)/gi, (match, id) => {
    return `([PMID: ${id}](https://pubmed.ncbi.nlm.nih.gov/${id}/))`;
  });
  
  // Replace PMIDs in table cells
  processedText = processedText.replace(/\|\s*(\d{7,9})\s*\|/g, (match, id) => {
    return `| [${id}](https://pubmed.ncbi.nlm.nih.gov/${id}/) |`;
  });
  
  return processedText;
};

export default function ChatMessage({ message }) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (message.type === 'assistant' && !message.isLoading) {
      // Show full text immediately for better UX
      setDisplayText(message.text);
    } else {
      setDisplayText(message.text);
    }
  }, [message.text, message.type, message.isLoading]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // System message
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm",
          message.isError 
            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
        )}>
          <Sparkles className="w-4 h-4" />
          {message.text}
        </div>
      </div>
    );
  }

  // Loading state
  if (message.isLoading) {
    return (
      <div className="flex gap-4 max-w-4xl mx-auto">
        <Avatar className="h-10 w-10 border border-purple-600/20">
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <Bot className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-purple-400">Vivum AI</span>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Loader2 className="w-3 h-3 animate-spin" />
              Analyzing
            </Badge>
          </div>
          <Card className="p-4 border-purple-600/20 bg-purple-600/5">
            <p className="text-sm text-purple-300">{message.text}</p>
          </Card>
        </div>
      </div>
    );
  }

  // User message
  if (message.type === 'user') {
    return (
      <div className="flex gap-4 max-w-4xl mx-auto">
        <div className="flex-1">
          <div className="flex justify-end items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-300">You</span>
          </div>
          <Card className="p-4 bg-gray-800/50 border-gray-700 ml-12">
            <p className="text-gray-100">{message.text}</p>
          </Card>
        </div>
        <Avatar className="h-10 w-10 border border-gray-700">
          <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-800 text-white">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex gap-4 max-w-4xl mx-auto group">
      <Avatar className="h-10 w-10 border border-purple-600/20">
        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <Bot className="w-5 h-5" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-purple-400">Vivum AI</span>
          {message.isError && <Badge variant="destructive" className="text-xs">Error</Badge>}
          
        </div>
        
        <Card className={cn(
          "p-5 relative transition-all",
          message.isError 
            ? "border-red-500/20 bg-red-500/5" 
            : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
        )}>
          {/* Copy button */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Message content with markdown */}
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({children}) => <p className="mb-3 leading-relaxed text-gray-200">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1.5 ml-2">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1.5 ml-2">{children}</ol>,
                li: ({children}) => <li className="text-gray-200">{children}</li>,
                a: ({href, children}) => {
                  const isPubMedLink = href && href.includes('pubmed.ncbi.nlm.nih.gov');
                  return (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/30 underline-offset-2 inline-flex items-center gap-1"
                    >
                      {children}
                      {isPubMedLink && <ExternalLink className="w-3 h-3" />}
                    </a>
                  );
                },
                strong: ({children}) => <strong className="font-semibold text-gray-50">{children}</strong>,
              }}
            >
              {processPubMedLinks(displayText)}
            </ReactMarkdown>
          </div>
        </Card>
      </div>
    </div>
  );
}