import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { FiMessageCircle, FiX, FiCpu, FiSend, FiMinimize2, FiMaximize2 } from "react-icons/fi";

export default function Topbar({ onMenuToggle }) {

  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [empOpen, setEmpOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
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

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleAdmin = () => setAdminOpen(!adminOpen);
  const toggleEmp = () => setEmpOpen(!empOpen);
  const toggleChatbot = () => setChatbotOpen(!chatbotOpen);
  const toggleMinimize = () => setIsMinimized(!isMinimized);

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

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "Thanks for your message! This is a demo of the HR Assistant. Add your Gemini API key to enable AI responses.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-3 sm:px-4 md:px-6">

        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="HRMS Logo" className="h-6 sm:h-8" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-gray-700 font-medium">




          {/* Admin Dropdown */}
          <div className="relative group">
            <button className="hover:text-green-600 transition-colors flex items-center">
              Admin <span className="ml-1 text-xs">▼</span>
            </button>

            <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 
              invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">

    
    
    
    
    
    

            </div>
          </div>

          {/* Employee Dropdown */}
          <div className="relative group">
            <button className="hover:text-green-600 transition-colors flex items-center">
              Employee <span className="ml-1 text-xs">▼</span>
            </button>

            <div className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 
              invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">

    
    
    
    
    

            </div>
          </div>




        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">

          {/* AI Chatbot Button */}
          <div className="relative">
            <button
              onClick={toggleChatbot}
              className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 relative group"
              title="HR Assistant - Click to open AI chat"
            >
              <FiMessageCircle className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center">
                <span className="text-xs font-bold">AI</span>
              </span>
            </button>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
              <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                HR Assistant - Get instant help with AI
              </div>
            </div>
          </div>

          <Link
            to="/login"
            className="px-3 xl:px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-sm font-medium"
          >
            Login
          </Link>

          <Link
            to="/login"
            className="px-3 xl:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Employee Access
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2">
          {/* Sidebar Toggle for Admin/Employee Pages */}
          {onMenuToggle && (
            <button
              className="lg:hidden text-gray-700 hover:text-green-600 transition-colors p-2"
              onClick={onMenuToggle}
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Main Mobile Menu Toggle */}
          <button
            className="lg:hidden text-gray-700 hover:text-green-600 transition-colors p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (

        <div className="lg:hidden bg-white border-t border-gray-200 px-3 sm:px-4 py-4 space-y-3 max-h-96 overflow-y-auto">

          {/* Main Navigation */}
          <div className="space-y-2">
            <Link 
              to="/" 
              className="block py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
              onClick={toggleMenu}
            >
              About
            </Link>
          </div>

          {/* Admin Mobile Accordion */}
          <div className="border-t border-gray-100 pt-3">
            <button
              onClick={toggleAdmin}
              className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
            >
              <span>Admin</span>
              <span className={`transform transition-transform ${adminOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {adminOpen && (
              <div className="mt-2 ml-3 space-y-1 border-l-2 border-gray-200 pl-3">
                <Link 
                  to="/admin/dashboard" 
                  className="block py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/attendance" 
                  className="block py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
                  onClick={toggleMenu}
                >
                  Attendance
                </Link>
                <Link 
                  to="/admin/employees" 
                  className="block py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
                  onClick={toggleMenu}
                >
                  Employees
                </Link>
                <Link 
                  to="/admin/leaves" 
                  className="block py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
                  onClick={toggleMenu}
                >
                  Leaves
                </Link>
                <Link 
                  to="/admin/payroll" 
                  className="block py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
                  onClick={toggleMenu}
                >
                  Payroll
                </Link>
                <Link 
                  to="/admin/reports" 
                  className="block py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
                  onClick={toggleMenu}
                >
                  Reports
                </Link>
              </div>
            )}
          </div>

          {/* Employee Mobile Accordion */}
          <div className="border-t border-gray-100 pt-3">
            <button
              onClick={toggleEmp}
              className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
            >
              <span>Employee</span>
              <span className={`transform transition-transform ${empOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {empOpen && (
              <div className="mt-2 ml-3 space-y-1 border-l-2 border-gray-200 pl-3">
                <Link 
                  to="/employee/dashboard" 
                  className="block py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/employee/attendance" 
                  className="block py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
                  onClick={toggleMenu}
                >
                  Attendance
                </Link>
                <Link 
                  to="/employee/applyleave" 
                  className="block py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
                  onClick={toggleMenu}
                >
                  Apply Leave
                </Link>
                <Link 
                  to="/employee/salary" 
                  className="block py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
                  onClick={toggleMenu}
                >
                  Salary
                </Link>
                <Link 
                  to="/employee/profile" 
                  className="block py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
              </div>
            )}
          </div>

          {/* Additional Links */}
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <Link 
              to="/features" 
              className="block py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
              onClick={toggleMenu}
            >
              Features
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 px-3 rounded transition-colors"
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <Link 
              to="/login" 
              className="block w-full py-3 text-center border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors font-medium"
              onClick={toggleMenu}
            >
              Login
            </Link>
            <Link 
              to="/login" 
              className="block w-full py-3 text-center bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
              onClick={toggleMenu}
            >
              Employee Access
            </Link>
          </div>

        </div>

      )}

    {/* AI Chatbot Window */}
      {chatbotOpen && (
        <div className="fixed top-16 right-4 z-[60] bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 w-96 sm:w-[440px] max-h-96">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <FiCpu className="w-5 h-5" />
              <span className="font-semibold">HR Assistant</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMinimize}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                {isMinimized ? <FiMaximize2 className="w-4 h-4" /> : <FiMinimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setChatbotOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <div className="overflow-y-auto p-4 space-y-3 h-64">
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
                      {message.sender === 'user' ? <FiMessageCircle className="w-4 h-4" /> : <FiCpu className="w-4 h-4" />}
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
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            </div>
          )}

          {/* Input Area */}
          {!isMinimized && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
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
                  onClick={() => setMessages([{
                    id: Date.now(),
                    text: "Chat cleared. How can I help you today?",
                    sender: "bot",
                    timestamp: new Date()
                  }])}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Clear chat
                </button>
                <span className="text-xs text-gray-400">
                  Powered by Gemini AI
                </span>
              </div>
            </div>
          )}
        </div>
      )}

    </nav>
  );
}
