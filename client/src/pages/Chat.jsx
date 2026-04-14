import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Send, MessageCircle, Users, Clock, AlertCircle, Trash2, RefreshCw, Globe, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Chat = () => {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [lastCleared, setLastCleared] = useState(null);
  const [chatAge, setChatAge] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const messagesEndRef = useRef(null);
  const heartbeatInterval = useRef(null);
  const chatInfoRef = useRef(null);
  const [chatHeight, setChatHeight] = useState('400px');

  // Get API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'https://hostel-hbz.onrender.com';

  useEffect(() => {
    initializeChat();
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (socket && chatId) {
      console.log('🔌 Setting up socket listeners for chat:', chatId);
      
      // Join the public chat room
      socket.emit('join_public_chat', chatId);
      
      // Listen for new messages
      socket.on('new_message', (message) => {
        console.log('📨 Received new message:', message);
        if (message.chatId === chatId) {
          setMessages(prev => {
            // Avoid duplicates
            const exists = prev.some(m => m._id === message._id);
            if (exists) return prev;
            return [...prev, message];
          });
        }
      });

      // Listen for chat cleared events
      socket.on('chat_cleared', (data) => {
        console.log('🧹 Chat was cleared:', data);
        if (data.chatId === chatId) {
          setMessages([]);
          setLastCleared(new Date(data.clearedAt));
          toast.info(`Chat history cleared by ${data.clearedBy}`);
        }
      });

      // Listen for user presence
      socket.on('user_joined_chat', (userData) => {
        setOnlineUsers(prev => prev + 1);
      });

      socket.on('user_left_chat', (userData) => {
        setOnlineUsers(prev => Math.max(0, prev - 1));
      });

      return () => {
        console.log('🔌 Cleaning up socket listeners');
        socket.off('new_message');
        socket.off('chat_cleared');
        socket.off('user_joined_chat');
        socket.off('user_left_chat');
      };
    }
  }, [socket, chatId]);

  // Update chat height based on chat info height
  useEffect(() => {
    const updateChatHeight = () => {
      if (chatInfoRef.current) {
        const infoHeight = chatInfoRef.current.clientHeight;
        setChatHeight(`${infoHeight}px`);
      }
    };

    // Initial update
    updateChatHeight();

    // Update on window resize
    window.addEventListener('resize', updateChatHeight);
    
    // Update after a short delay to ensure all elements are rendered
    const timer = setTimeout(updateChatHeight, 500);

    return () => {
      window.removeEventListener('resize', updateChatHeight);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Update connection status based on socket connection
    if (connected) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('disconnected');
    }
  }, [connected]);

  useEffect(() => {
    // Update chat age every minute
    const interval = setInterval(() => {
      if (lastCleared) {
        setChatAge(Date.now() - new Date(lastCleared).getTime());
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [lastCleared]);

  useEffect(() => {
    // Start heartbeat to maintain active user count
    if (chatId) {
      heartbeatInterval.current = setInterval(() => {
        sendHeartbeat();
      }, 30000); // Every 30 seconds
    }

    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    };
  }, [chatId]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      setConnectionStatus('connecting');
      console.log('🚀 Initializing public chat...');
      
      const response = await axios.get(`${API_URL}/api/chat/public-chat`);
      const { chatId: newChatId, lastCleared: cleared, activeUserCount } = response.data;
      
      setChatId(newChatId);
      setLastCleared(new Date(cleared));
      setOnlineUsers(activeUserCount || 0);
      
      console.log('✅ Public chat initialized:', newChatId);
      
      // Load messages
      await loadMessages(newChatId);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('❌ Error initializing chat:', error);
      setConnectionStatus('error');
      toast.error('Failed to initialize chat');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatIdToLoad) => {
    try {
      console.log('📥 Loading messages for chat:', chatIdToLoad);
      
      const response = await axios.get(`${API_URL}/api/chat/${chatIdToLoad}/messages`);
      const { messages: loadedMessages, lastCleared: cleared, chatAge: age, activeUserCount } = response.data;
      
      setMessages(loadedMessages || []);
      setLastCleared(new Date(cleared));
      setChatAge(age);
      setOnlineUsers(activeUserCount || 0);
      
      console.log(`📊 Loaded ${loadedMessages?.length || 0} messages`);
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendHeartbeat = async () => {
    if (!chatId) return;
    
    try {
      const response = await axios.post(`${API_URL}/api/chat/${chatId}/heartbeat`);
      setOnlineUsers(response.data.activeUserCount);
    } catch (error) {
      console.error('❌ Error sending heartbeat:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || sending) return;

    const messageContent = newMessage.trim();
    if (messageContent.length > 500) {
      toast.error('Message too long. Maximum 500 characters allowed.');
      return;
    }

    setNewMessage('');
    setSending(true);

    try {
      console.log('📤 Sending message:', messageContent.substring(0, 50) + '...');
      
      await axios.post(`${API_URL}/api/chat/${chatId}/messages`, {
        content: messageContent
      });
      
      console.log('✅ Message sent successfully');
    } catch (error) {
      console.error('❌ Error sending message:', error);
      toast.error('Failed to send message');
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const clearChat = async () => {
    if (!user || user.role !== 'admin') {
      toast.error('Only admins can clear chat history');
      return;
    }

    if (!window.confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🧹 Admin clearing chat...');
      await axios.post(`${API_URL}/api/chat/${chatId}/clear`);
      toast.success('Chat history cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing chat:', error);
      toast.error('Failed to clear chat history');
    }
  };

  const refreshChat = async () => {
    if (chatId) {
      await loadMessages(chatId);
      toast.success('Chat refreshed');
    }
  };

  const formatChatAge = (ageInMs) => {
    const hours = Math.floor(ageInMs / (1000 * 60 * 60));
    const minutes = Math.floor((ageInMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
  };

  const getTimeUntilClear = () => {
    if (!lastCleared) return null;
    
    const clearTime = new Date(lastCleared).getTime() + (24 * 60 * 60 * 1000);
    const timeLeft = clearTime - Date.now();
    
    if (timeLeft <= 0) return 'Chat will be cleared soon';
    
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `Auto-clear in ${hoursLeft}h ${minutesLeft}m`;
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'connecting':
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-500" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 border-b-2 border-blue-600 loading-spinner"></div>
          <p className="text-gray-600 dark:text-gray-400">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900" id="main-content">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="flex items-center gap-3 mb-2 text-3xl font-bold text-gray-800 dark:text-gray-200">
            <Globe className="w-8 h-8" />
            Public Chat Support
          </h1>
          <div className="flex items-center space-x-4 text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Connect with everyone in real-time
            </p>
            <div className="flex items-center space-x-1">
              {getConnectionIcon()}
              <span className={`${
                connectionStatus === 'connected' ? 'text-green-600 dark:text-green-400' :
                connectionStatus === 'connecting' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {getConnectionText()}
              </span>
            </div>
            {lastCleared && (
              <span className="flex items-center text-yellow-600 dark:text-yellow-400">
                <Clock className="w-4 h-4 mr-1" />
                {getTimeUntilClear()}
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Chat Info Sidebar - Increased width from 1 to 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
            ref={chatInfoRef}
          >
            <div className="space-y-6 card">
              <div>
                <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  <MessageCircle className="w-5 h-5" />
                  Chat Info
                </h3>
                
                <div className="space-y-4">
                  <div className="p-3 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <div className="font-medium text-blue-800 dark:text-blue-200">Public Chat</div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">Everyone can see messages</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Auto-Clear</div>
                        <div className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                          Chat history is automatically cleared every 24 hours for privacy and performance.
                        </div>
                        {lastCleared && (
                          <div className="mt-2 text-xs text-yellow-500 dark:text-yellow-500">
                            Last cleared: {formatChatAge(chatAge)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Messages:</span>
                      <span className="font-medium">{messages.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Online:</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="w-3 h-3" />
                        {onlineUsers}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Connection:</span>
                      <span className="flex items-center gap-1 font-medium">
                        {getConnectionIcon()}
                        {getConnectionText()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Controls */}
              {user?.role === 'admin' && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="mb-3 font-medium text-gray-800 dark:text-gray-200">Admin Controls</h4>
                  <div className="space-y-2">
                    <button
                      onClick={clearChat}
                      className="w-full btn btn-sm btn-danger"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Chat History
                    </button>
                    <button
                      onClick={refreshChat}
                      className="w-full btn btn-sm btn-outline"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh Chat
                    </button>
                  </div>
                </div>
              )}

              {/* Chat Guidelines */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="mb-3 font-medium text-gray-800 dark:text-gray-200">Guidelines</h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>• Be respectful to all users</p>
                  <p>• Keep conversations appropriate</p>
                  <p>• No spam or excessive messaging</p>
                  <p>• Messages are visible to everyone</p>
                  <p>• History clears every 24 hours</p>
                  <p>• Maximum 500 characters per message</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat Area - Adjusted to 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="flex flex-col card" style={{ height: chatHeight }}>
              {/* Chat Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-600">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Public Chat Room</h3>
                    <p className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      {getConnectionIcon()}
                      {connectionStatus === 'connected' ? `${onlineUsers} users online` : getConnectionText()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getTimeUntilClear() && (
                    <span className="px-2 py-1 text-xs text-yellow-600 rounded dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
                      {getTimeUntilClear()}
                    </span>
                  )}
                  <button
                    onClick={refreshChat}
                    className="p-2 text-gray-600 transition-colors dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 px-2 py-4 space-y-4 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p>No messages yet. Start the conversation!</p>
                    <p className="mt-2 text-sm">This is a public chat - everyone can see your messages.</p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isOwnMessage = message.sender?._id === user?._id;
                    const showAvatar = index === 0 || messages[index - 1]?.sender?._id !== message.sender?._id;
                    const isSystemMessage = message.messageType === 'system';
                    
                    if (isSystemMessage) {
                      return (
                        <div key={`${message._id || index}-${message.timestamp}`} className="flex justify-center">
                          <div className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-400">
                            {message.content}
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div
                        key={`${message._id || index}-${message.timestamp}`}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {/* Avatar */}
                          {showAvatar && (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                              isOwnMessage 
                                ? 'bg-blue-600 text-white' 
                                : message.sender?.role === 'admin'
                                ? 'bg-red-600 text-white'
                                : message.sender?.role === 'staff'
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-600 text-white'
                            }`}>
                              {message.sender?.name?.charAt(0) || 'U'}
                            </div>
                          )}
                          
                          {/* Message Bubble */}
                          <div className={`px-4 py-2 rounded-lg ${
                            isOwnMessage
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          }`}>
                            {/* Sender Name (for others' messages) */}
                            {!isOwnMessage && showAvatar && (
                              <div className="flex items-center gap-1 mb-1 text-xs font-medium opacity-75">
                                {message.sender?.name || 'Unknown User'}
                                {message.sender?.role === 'admin' && (
                                  <span className="px-1 text-xs text-white bg-red-500 rounded">Admin</span>
                                )}
                                {message.sender?.role === 'staff' && (
                                  <span className="px-1 text-xs text-white bg-teal-500 rounded">Staff</span>
                                )}
                              </div>
                            )}
                            
                            {/* Message Content */}
                            <div className="break-words">{message.content}</div>
                            
                            {/* Timestamp */}
                            <div className="mt-1 text-xs text-right opacity-75">
                              {new Date(message.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={connectionStatus === 'connected' ? "Type your message..." : "Connecting..."}
                    className="flex-1 input"
                    disabled={connectionStatus !== 'connected' || sending}
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={connectionStatus !== 'connected' || !newMessage.trim() || sending}
                    className="btn btn-primary"
                  >
                    {sending ? (
                      <div className="w-5 h-5 loading-spinner" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-500">
                  <span>Messages are visible to all users</span>
                  <span className={newMessage.length > 450 ? 'text-red-500 font-medium' : ''}>
                    {newMessage.length}/500
                  </span>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Chat History Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 border-blue-200 card bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="mb-2 text-lg font-semibold text-blue-800 dark:text-blue-200">Privacy Notice</h3>
              <p className="mb-3 text-blue-700 dark:text-blue-300">
                This is a public chat room where all messages are visible to every user. Chat history is automatically 
                cleared every 24 hours to maintain privacy and system performance.
              </p>
              <div className="grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <div className="font-medium text-blue-800 dark:text-blue-200">Current Session</div>
                  <div className="text-blue-600 dark:text-blue-400">
                    {lastCleared ? `Started ${formatChatAge(chatAge)}` : 'Just started'}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-blue-800 dark:text-blue-200">Next Auto-Clear</div>
                  <div className="text-blue-600 dark:text-blue-400">
                    {getTimeUntilClear() || 'Soon'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chat;