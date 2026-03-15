import { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiSend, FiX, FiCpu, FiUser, FiMinimize2, FiMaximize2 } from "react-icons/fi";

export default function AIChatbot() {
  console.log('AIChatbot component rendering...');
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your HR Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Gemini API configuration
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const generateHRContext = () => {
    return `
You are a helpful HR Assistant for an HRMS (Human Resource Management System). 
You help employees with questions about:
- Employee management and policies
- Leave requests and attendance
- Payroll and salary information
- Benefits and company policies
- IT support and technical issues
- Department procedures
- Performance reviews
- Training and development

Guidelines:
- Be professional, friendly, and helpful
- Provide accurate HR-related information
- If you don't know something, suggest contacting HR department
- Keep responses concise and relevant
- Use bullet points for complex information
- For specific personal data, advise to use official HR channels

Current context: HRMS System with departments: IT, HR, Finance, Marketing, Sales, Operations
    `;
  };

  const callGeminiAPI = async (message) => {
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${generateHRContext()}\n\nUser Question: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.candidates[0]?.content?.parts[0]?.text || 
        "I apologize, but I'm having trouble processing your request. Please try again or contact HR directly.";

      return botResponse;
    } catch (error) {
      console.error('Gemini API Error:', error);
      return "I'm experiencing technical difficulties. Please try again later or contact the HR department for immediate assistance.";
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const botResponse = await callGeminiAPI(inputMessage.trim());
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: "bot",
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 500);
    } catch (error) {
      setIsTyping(false);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      text: "Chat cleared. How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }]);
  };

  const quickActions = [
    { text: "How to apply for leave?", icon: "📝" },
    { text: "Check attendance policy", icon: "📅" },
    { text: "Salary inquiry", icon: "💰" },
    { text: "IT support", icon: "💻" }
  ];

  return (
    <>
      {/* Debug Test - Always Visible Red Box */}
      <div className="fixed bottom-4 right-4 z-[70] w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
        AI
      </div>

      {/* Chat Button */}
      <button
        onClick={() => {
          console.log('Chat button clicked!');
          setIsOpen(true);
        }}
        className={`fixed bottom-4 right-4 z-[60] p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
          isOpen ? 'hidden' : 'flex'
        } items-center justify-center`}
      >
        <FiMessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-4 right-4 z-[60] bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
          isMinimized ? 'h-14 w-80' : 'h-96 w-96 sm:w-[440px]'
        }`}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <FiCpu className="w-5 h-5" />
              <span className="font-semibold">HR Assistant</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                {isMinimized ? <FiMaximize2 className="w-4 h-4" /> : <FiMinimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 h-64">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      }`}>
                        {message.sender === 'user' ? <FiUser className="w-4 h-4" /> : <FiBot className="w-4 h-4" />}
                      </div>
                      <div className={`px-3 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center">
                        <FiCpu className="w-4 h-4" />
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-gray-100">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 border-t border-gray-100">
                <div className="flex space-x-2 overflow-x-auto">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(action.text)}
                      className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 whitespace-nowrap transition-colors"
                    >
                      <span>{action.icon}</span>
                      <span>{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiSend className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <button
                    onClick={clearChat}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear chat
                  </button>
                  <span className="text-xs text-gray-400">
                    Powered by Gemini AI
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
