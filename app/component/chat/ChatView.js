// app/components/chat/ChatView.js
import React from 'react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';

export default function ChatView({ 
  chatMessages, 
  chatInput, 
  setChatInput, 
  handleSendMessage, 
  topicStatus 
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
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