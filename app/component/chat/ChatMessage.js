// app/components/chat/ChatMessage.js
import React, { useState, useEffect } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Function to convert PubMed IDs to links
const processPubMedLinks = (text) => {
  // Multiple patterns to match PubMed IDs in different contexts
  const patterns = [
    // Match "PubMed ID: 12345678" or "PMID: 12345678"
    /(?:PubMed ID|PMID):\s*(\d{7,8})/gi,
    // Match standalone 7-8 digit numbers in specific contexts
    /\|\s*(\d{7,8})\s*\|/g,
    // Match "12345678 |" pattern
    /\|\s*(\d{7,8})\s*\|/g,
  ];
  
  let processedText = text;
  
  // First pass: Replace clear PubMed ID references
  processedText = processedText.replace(/(?:PubMed ID|PMID):\s*(\d{7,8})/gi, (match, id) => {
    return `[PubMed ID: ${id}](https://pubmed.ncbi.nlm.nih.gov/${id}/)`;
  });
  
  // Second pass: Replace IDs in table cells (between pipes)
  processedText = processedText.replace(/\|\s*(\d{7,8})\s*\|/g, (match, id) => {
    return `| [${id}](https://pubmed.ncbi.nlm.nih.gov/${id}/) |`;
  });
  
  return processedText;
};

export default function ChatMessage({ message }) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (message.type === 'assistant' && !message.isLoading) {
      setIsTyping(true);
      const text = message.text;
      
      // Split into words for faster, more natural streaming
      const words = text.split(' ');
      let currentWordIndex = 0;
      let displayedWords = [];

      const streamText = () => {
        if (currentWordIndex < words.length) {
          displayedWords.push(words[currentWordIndex]);
          setDisplayText(displayedWords.join(' '));
          currentWordIndex++;
          // Fast streaming - 30ms per word (like ChatGPT)
          setTimeout(streamText, 30);
        } else {
          setIsTyping(false);
        }
      };

      streamText();
    } else {
      setDisplayText(message.text);
    }
  }, [message.text, message.type, message.isLoading]);

  // Don't render the initial loading message once articles are ready
  if (message.isInitialLoad && !message.isLoading) {
    return null;
  }

  // Show loading state with animation
  if (message.isLoading) {
    return (
      <div className="flex gap-3 animate-in fade-in slide-in-from-left duration-300">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0 animate-pulse">
          AI
        </div>
        <div className="max-w-[85%]">
          <div className="p-3 rounded-2xl bg-gray-800 border border-gray-700">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <p className="text-sm text-gray-300">
                {message.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular message rendering with animations
  return (
    <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : ''} animate-in fade-in ${message.type === 'user' ? 'slide-in-from-right' : 'slide-in-from-left'} duration-300`}>
      {message.type === 'assistant' && (
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
          AI
        </div>
      )}
      
      <div className={`max-w-[85%] ${message.type === 'user' ? 'order-1' : ''}`}>
        <div className={`p-3 rounded-2xl ${
          message.type === 'user' 
            ? 'bg-purple-600 text-white' 
            : message.isError
            ? 'bg-red-500/10 border border-red-500/20'
            : 'bg-gray-800 border border-gray-700'
        }`}>
          {message.type === 'assistant' ? (
            <div className="w-full overflow-hidden">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({children}) => <h1 className="text-xl font-bold mb-2 mt-3">{children}</h1>,
                  h2: ({children}) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                  h3: ({children}) => <h3 className="text-base font-bold mb-2 mt-3">{children}</h3>,
                  p: ({children}) => <p className="mb-2 leading-relaxed text-gray-300">{children}</p>,
                  ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({children}) => <li className="text-gray-300">{children}</li>,
                  code: ({inline, children}) => 
                    inline ? 
                      <code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-purple-400">{children}</code> :
                      <pre className="bg-gray-700 p-3 rounded-lg my-2 overflow-x-auto">
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
                    <tr className="hover:bg-gray-700/50 transition-colors">
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
                    <blockquote className="border-l-4 border-purple-500 pl-3 my-2 italic text-gray-300">
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
                        className="text-purple-400 hover:underline inline-flex items-center gap-1"
                      >
                        {children}
                        {isPubMedLink && <ExternalLink className="w-3 h-3" />}
                      </a>
                    );
                  },
                  strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                  em: ({children}) => <em className="italic">{children}</em>,
                  hr: () => <hr className="my-3 border-gray-700" />,
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
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Citations:</div>
              {message.citations.map((citation, cidx) => (
                <div key={cidx} className="text-sm mb-1">
                  <a 
                    href={`https://doi.org/${citation.doi}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:underline flex items-center gap-1"
                  >
                    {citation.title}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-xs text-gray-400"> - {citation.source}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {message.type === 'user' && (
        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 font-semibold flex-shrink-0">
          U
        </div>
      )}
    </div>
  );
}