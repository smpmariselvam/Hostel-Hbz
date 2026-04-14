import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const { user, isAuthenticated } = useAuth();

  // Get socket URL from environment variables
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://hostel-hbz.onrender.com';

  useEffect(() => {
    if (isAuthenticated() && user) {
      console.log('🔌 Initializing socket connection for user:', user.email);
      console.log('🔌 Socket URL:', SOCKET_URL);
      
      const newSocket = io(SOCKET_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('✅ Connected to server with socket ID:', newSocket.id);
        setConnected(true);
        setReconnectAttempts(0);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ Disconnected from server. Reason:', reason);
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error.message);
        setReconnectAttempts(prev => prev + 1);
      });

      newSocket.on('reconnect_attempt', (attemptNumber) => {
        console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
      });

      newSocket.on('reconnect', (attemptNumber) => {
        console.log(`✅ Reconnected after ${attemptNumber} attempts`);
        setConnected(true);
      });

      newSocket.on('reconnect_failed', () => {
        console.error('❌ Failed to reconnect after multiple attempts');
      });

      setSocket(newSocket);

      return () => {
        console.log('🔌 Closing socket connection');
        newSocket.close();
      };
    }
  }, [user, isAuthenticated, SOCKET_URL]);

  const joinRoom = (roomId) => {
    if (socket && connected) {
      console.log(`🏠 Joining room: ${roomId}`);
      socket.emit('join_room', roomId);
    } else {
      console.warn('⚠️ Cannot join room: Socket not connected');
    }
  };

  const joinPublicChat = (chatId) => {
    if (socket && connected) {
      console.log(`🌐 Joining public chat: ${chatId}`);
      socket.emit('join_public_chat', chatId);
    } else {
      console.warn('⚠️ Cannot join public chat: Socket not connected');
    }
  };

  const sendMessage = (roomId, message) => {
    if (socket && connected) {
      console.log(`💬 Sending message to room ${roomId}`);
      socket.emit('send_message', {
        room: roomId,
        message,
        sender: user
      });
      return true;
    } else {
      console.warn('⚠️ Cannot send message: Socket not connected');
      return false;
    }
  };

  const value = {
    socket,
    connected,
    reconnectAttempts,
    joinRoom,
    joinPublicChat,
    sendMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};