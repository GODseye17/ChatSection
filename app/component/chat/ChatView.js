// app/components/chat/ChatView.js
import React from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';

export default function ChatView({ 
  chatMessages, 
  chatInput, 
  setChatInput, 
  handleSendMessage, 
  topicStatus,
  showSources,
  setShowSources,
  articles
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white relative">
      <div className="flex-1 relative">
        <ChatMessageList messages={chatMessages} />
      </div>
      
      <div className="border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleSendMessage={handleSendMessage}
            topicStatus={topicStatus}
          />
          
          {articles.length > 0 && (
            <button
              onClick={() => setShowSources(true)}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2 mx-auto"
            >
              View {articles.length} source{articles.length !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}