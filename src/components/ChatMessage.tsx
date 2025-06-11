import React from "react";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`flex ${
        message.isUser ? "justify-end" : "justify-start"
      } animate-fadeIn`}
    >
      <div
        className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 rounded-2xl shadow-lg backdrop-blur-md ${
          message.isUser
            ? "bg-indigo-600/80 text-white border border-indigo-500/50"
            : "bg-gray-800/80 text-gray-200 border border-gray-700/50"
        } transition-all duration-300 hover:shadow-xl`}
      >
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.text}
        </p>
        <p className="text-xs text-gray-400 mt-2 opacity-80">
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
