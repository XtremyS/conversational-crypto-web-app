import React from "react";
import { FaMicrophone } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleMicClick: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  input,
  setInput,
  handleSubmit,
  handleMicClick,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gradient-to-r from-indigo-900 to-gray-800 shadow-lg flex items-center gap-3 rounded-lg"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 p-3 bg-gray-800/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 placeholder-gray-400"
        placeholder="Ask about crypto..."
      />
      <button
        type="button"
        onClick={handleMicClick}
        className="p-3 bg-gray-700/50 text-white rounded-xl hover:bg-indigo-600/70 hover:scale-105 transition-all duration-300 shadow-md"
      >
        <FaMicrophone className="w-5 h-5" />
      </button>
      <button
        type="submit"
        className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:scale-105 transition-all duration-300 shadow-md"
      >
        <IoSend className="w-5 h-5" />
      </button>
    </form>
  );
};

export default InputArea;
