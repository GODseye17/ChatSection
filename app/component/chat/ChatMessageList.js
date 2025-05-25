// app/components/chat/ChatMessageList.js
import React from 'react';
import ChatMessage from './ChatMessage';

export default function ChatMessageList({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message, idx) => (
          <ChatMessage key={idx} message={message} />
        ))}
      </div>
    </div>
  );
}