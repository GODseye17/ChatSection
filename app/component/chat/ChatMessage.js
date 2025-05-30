// app/component/chat/ChatMessage.js
import React, { useState, useEffect } from 'react';
import { Loader2, ExternalLink, User, Bot, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Function to convert PubMed IDs to links
const processPubMedLinks = (text) => {
  let processedText = text;
  
  processedText = processedText.replace(/(?:PubMed ID|PMID):\s*(\d{7,8})/gi, (match, id) => {
    return `[PubMed ID: ${id}](https://pubmed.ncbi.nlm.nih.gov/${id}/)`;
  });
  
  processedText = processedText.replace(/\|\s*(\d{7,8})\s*\|/g, (match, id) => {
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

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.isInitialLoad && !message.isLoading) {
    return null;
  }

  if (message.isLoading) {
    return (
      <div className="flex gap-3 px-4 py-6">
        <Avatar className="h-8 w-8 border border-purple-500/20">
          <AvatarFallback className="bg-purple-600 text-white">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 max-w-3xl">
          <Card className="p-4 border-gray-800 bg-gray-900/50">
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">{message.text}</span>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={cn(
        "flex gap-3 px-4 py-6 transition-all",
        message.type === 'user' && "flex-row-reverse"
      )}>
        <Avatar className={cn(
          "h-8 w-8 border",
          message.type === 'user' 
            ? "border-gray-700" 
            : "border-purple-500/20"
        )}>
          <AvatarFallback className={cn(
            message.type === 'user'
              ? "bg-gray-800 text-gray-300"
              : "bg-purple-600 text-white"
          )}>
            {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        
        <div className={cn(
          "flex-1 max-w-3xl",
          message.type === 'user' && "flex justify-end"
        )}>
          <Card className={cn(
            "relative group",
            message.type === 'user' 
              ? "bg-purple-600 text-white border-purple-700 max-w-[80%]" 
              : message.isError
              ? "bg-red-950/50 border-red-900"
              : "bg-gray-900/50 border-gray-800"
          )}>
            {message.type === 'assistant' && (
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 bg-gray-800 hover:bg-gray-700"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? 'Copied!' : 'Copy message'}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
            
            <div className="p-4">
              {message.type === 'assistant' ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({children}) => <h1 className="text-xl font-bold mb-3 mt-4 text-gray-100">{children}</h1>,
                      h2: ({children}) => <h2 className="text-lg font-bold mb-2 mt-3 text-gray-100">{children}</h2>,
                      h3: ({children}) => <h3 className="text-base font-bold mb-2 mt-3 text-gray-100">{children}</h3>,
                      p: ({children}) => <p className="mb-3 leading-relaxed text-gray-300">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-300">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-300">{children}</ol>,
                      li: ({children}) => <li className="text-gray-300">{children}</li>,
                      code: ({inline, children}) => 
                        inline ? 
                          <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-purple-400">{children}</code> :
                          <pre className="bg-gray-800 p-3 rounded-lg my-3 overflow-x-auto border border-gray-700">
                            <code className="text-sm font-mono text-gray-300">{children}</code>
                          </pre>,
                      table: ({children}) => (
                        <div className="my-3 w-full overflow-x-auto rounded-lg border border-gray-700">
                          <table className="w-full divide-y divide-gray-700">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({children}) => (
                        <thead className="bg-gray-800">
                          {children}
                        </thead>
                      ),
                      tbody: ({children}) => (
                        <tbody className="divide-y divide-gray-700">
                          {children}
                        </tbody>
                      ),
                      tr: ({children}) => (
                        <tr className="hover:bg-gray-800/50 transition-colors">
                          {children}
                        </tr>
                      ),
                      th: ({children}) => (
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {children}
                        </th>
                      ),
                      td: ({children}) => (
                        <td className="px-3 py-2 text-sm text-gray-300">
                          {children}
                        </td>
                      ),
                      blockquote: ({children}) => (
                        <blockquote className="border-l-4 border-purple-500 pl-4 my-3 italic text-gray-300">
                          {children}
                        </blockquote>
                      ),
                      a: ({href, children}) => {
                        const isPubMedLink = href && href.includes('pubmed.ncbi.nlm.nih.gov');
                        return (
                          <a 
                            href={href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-purple-400 hover:text-purple-300 underline decoration-dotted underline-offset-2 inline-flex items-center gap-1"
                          >
                            {children}
                            {isPubMedLink && <ExternalLink className="h-3 w-3" />}
                          </a>
                        );
                      },
                      strong: ({children}) => <strong className="font-semibold text-gray-100">{children}</strong>,
                      em: ({children}) => <em className="italic">{children}</em>,
                      hr: () => <hr className="my-4 border-gray-700" />,
                    }}
                  >
                    {isTyping ? displayText : processPubMedLinks(message.text)}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">
                  {message.text}
                </p>
              )}
              
              {message.citations && message.citations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs border-gray-700">
                      {message.citations.length} Citation{message.citations.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {message.citations.map((citation, cidx) => (
                      <div key={cidx} className="text-sm">
                        <a 
                          href={`https://doi.org/${citation.doi}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 flex items-start gap-2 group"
                        >
                          <span className="line-clamp-2">{citation.title}</span>
                          <ExternalLink className="h-3 w-3 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </a>
                        <span className="text-xs text-gray-500 mt-1 block">{citation.source}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}