import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import {
  FiMessageCircle,
  FiX,
  FiCpu,
  FiSend,
  FiMinimize2,
  FiMaximize2,
  FiUser,
  FiLogOut,
  FiHome,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";

export default function Topbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your HR Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleChatbot = () => setChatbotOpen(!chatbotOpen);
  const toggleMinimize = () => setIsMinimized(!isMinimized);
  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : "/employee/dashboard";
  const profilePath = user?.role === "employee" ? "/employee/profile" : dashboardPath;
  const loginTarget = !loading && user ? dashboardPath : "/login";
  const userName = user?.full_name || user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setProfileMenuOpen(false);
    navigate("/");
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "Thanks for your message! This is a demo of the HR Assistant. Add your Gemini API key to enable AI responses.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="HRMS Logo" className="h-6 sm:h-8" />
        </Link>

        <div className="ml-auto hidden items-center space-x-2 xl:space-x-4 lg:flex">
          {/* HR Assistant temporarily disabled
          <div className="relative">
            <button
              onClick={toggleChatbot}
              className="relative rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-2 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              title="HR Assistant - Click to open AI chat"
            >
              <FiMessageCircle className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center text-xs font-bold">
                AI
              </span>
            </button>
          </div>
          */}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center space-x-3 rounded-full border border-gray-200 bg-white px-3 py-2 transition-colors hover:bg-gray-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
                  {userInitial}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs capitalize text-gray-500">{user.role}</p>
                </div>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                  <Link
                    to={dashboardPath}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <FiHome className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to={profilePath}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <FiUser className="mr-2 h-4 w-4" />
                    {user.role === "employee" ? "My Profile" : "Account"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    <FiLogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={loginTarget}
              className="rounded-md border border-green-600 px-3 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50 xl:px-4"
            >
              Login
            </Link>
          )}
        </div>

        <div className="ml-auto flex items-center space-x-2 lg:hidden">
          {!user && (
            <Link
              to={loginTarget}
              className="rounded-md border border-green-600 px-3 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-50 lg:hidden"
            >
              Login
            </Link>
          )}

          {user && (
            <Link
              to={profilePath}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white lg:hidden"
            >
              {userInitial}
            </Link>
          )}

          {onMenuToggle && (
            <button
              className="p-2 text-gray-700 transition-colors hover:text-green-600 lg:hidden"
              onClick={onMenuToggle}
              aria-label="Toggle sidebar"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <button
            className="p-2 text-gray-700 transition-colors hover:text-green-600 lg:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="relative flex h-5 w-6 flex-col justify-between">
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}></span>
            </div>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="max-h-96 space-y-3 overflow-y-auto border-t border-gray-200 bg-white px-3 py-4 sm:px-4 lg:hidden">
          <div className="space-y-2">
            <Link
              to="/"
              className="block rounded px-3 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-green-600"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block rounded px-3 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-green-600"
              onClick={toggleMenu}
            >
              About
            </Link>
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-3">
            <Link
              to="/features"
              className="block rounded px-3 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-green-600"
              onClick={toggleMenu}
            >
              Features
            </Link>
            <Link
              to="/contact"
              className="block rounded px-3 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-green-600"
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </div>

          <div className="space-y-2 border-t border-gray-200 pt-4">
            {user ? (
              <>
                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs capitalize text-gray-500">{user.role}</p>
                </div>
                <Link
                  to={dashboardPath}
                  className="flex items-center rounded-md px-3 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  onClick={toggleMenu}
                >
                  <FiHome className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to={profilePath}
                  className="flex items-center rounded-md px-3 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  onClick={toggleMenu}
                >
                  <FiUser className="mr-2 h-4 w-4" />
                  {user.role === "employee" ? "My Profile" : "Account"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center rounded-md px-3 py-3 font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <FiLogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to={loginTarget}
                className="block w-full rounded-md border border-green-600 py-3 text-center font-medium text-green-600 transition-colors hover:bg-green-50"
                onClick={toggleMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* HR Assistant temporarily disabled
      {chatbotOpen && (
        <div className="fixed right-4 top-16 z-[60] max-h-96 w-96 rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 sm:w-[440px]">
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
            <div className="flex items-center space-x-2">
              <FiCpu className="h-5 w-5" />
              <span className="font-semibold">HR Assistant</span>
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={toggleMinimize} className="rounded p-1 transition-colors hover:bg-white/20">
                {isMinimized ? <FiMaximize2 className="h-4 w-4" /> : <FiMinimize2 className="h-4 w-4" />}
              </button>
              <button onClick={() => setChatbotOpen(false)} className="rounded p-1 transition-colors hover:bg-white/20">
                <FiX className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="h-64 space-y-3 overflow-y-auto p-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex max-w-[80%] items-start space-x-2 ${
                      message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      }`}
                    >
                      {message.sender === "user" ? <FiMessageCircle className="h-4 w-4" /> : <FiCpu className="h-4 w-4" />}
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`mt-1 text-xs ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <FiCpu className="h-4 w-4" />
                    </div>
                    <div className="rounded-lg bg-gray-100 px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.1s" }}></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isMinimized && (
            <div className="border-t border-gray-100 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-white transition-colors hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiSend className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <button
                  onClick={() =>
                    setMessages([
                      {
                        id: Date.now(),
                        text: "Chat cleared. How can I help you today?",
                        sender: "bot",
                        timestamp: new Date(),
                      },
                    ])
                  }
                  className="text-xs text-gray-500 transition-colors hover:text-gray-700"
                >
                  Clear chat
                </button>
                <span className="text-xs text-gray-400">Powered by Gemini AI</span>
              </div>
            </div>
          )}
        </div>
      )}
      */}
    </nav>
  );
}
