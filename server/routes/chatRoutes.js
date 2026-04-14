import express from 'express';
import Chat from '../models/Chat.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get or create the global public chat
router.get('/public-chat', authenticateToken, async (req, res) => {
  try {
    console.log('📱 Getting public chat for user:', req.user.email);
    
    // Find or create the global public chat
    let chat = await Chat.findOne({ isActive: true });
    
    if (!chat) {
      console.log('🆕 Creating new public chat');
      chat = new Chat({
        messages: [],
        isActive: true,
        lastCleared: new Date(),
        activeUsers: []
      });
      await chat.save();
      
      // Add welcome system message
      await chat.addSystemMessage('Welcome to HostelHub Public Chat! Messages are visible to all users and automatically cleared every 24 hours.');
    }

    // Check if chat needs to be cleared (24 hours old)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (chat.lastCleared < twentyFourHoursAgo) {
      console.log('🧹 Auto-clearing chat history (24+ hours old)');
      chat.messages = [];
      chat.lastCleared = new Date();
      await chat.save();
      
      // Add system message about auto-clear
      await chat.addSystemMessage('Chat history has been automatically cleared. This happens every 24 hours for privacy and performance.');
    }

    // Update user's last seen
    const existingUserIndex = chat.activeUsers.findIndex(
      user => user.userId && user.userId.toString() === req.user._id.toString()
    );
    
    if (existingUserIndex >= 0) {
      chat.activeUsers[existingUserIndex].lastSeen = new Date();
    } else {
      chat.activeUsers.push({
        userId: req.user._id,
        lastSeen: new Date()
      });
    }
    
    // Clean up inactive users (not seen in last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    chat.activeUsers = chat.activeUsers.filter(user => 
      new Date(user.lastSeen) > thirtyMinutesAgo
    );
    
    await chat.save();

    res.json({
      chatId: chat._id,
      lastCleared: chat.lastCleared,
      messageCount: chat.messages.length,
      activeUserCount: chat.activeUsers.length
    });
  } catch (error) {
    console.error('❌ Error getting public chat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get chat messages (only messages from last 24 hours)
router.get('/:chatId/messages', authenticateToken, async (req, res) => {
  try {
    console.log('📨 Getting messages for chat:', req.params.chatId);
    
    const chat = await Chat.findById(req.params.chatId)
      .populate('messages.sender', 'name email role');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Filter messages from last 24 hours only
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentMessages = chat.messages.filter(message => 
      new Date(message.timestamp) > twentyFourHoursAgo
    );

    // Sort messages by timestamp (oldest first)
    recentMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    console.log(`📊 Returning ${recentMessages.length} recent messages`);

    res.json({
      messages: recentMessages,
      lastCleared: chat.lastCleared,
      totalMessages: recentMessages.length,
      chatAge: Date.now() - new Date(chat.lastCleared).getTime(),
      activeUserCount: chat.activeUsers.length
    });
  } catch (error) {
    console.error('❌ Error getting messages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send message to public chat
router.post('/:chatId/messages', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    console.log('💬 New message from:', req.user.email, 'Content:', content?.substring(0, 50) + '...');
    
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    if (content.trim().length > 500) {
      return res.status(400).json({ message: 'Message too long. Maximum 500 characters allowed.' });
    }

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if chat needs to be cleared before adding new message
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (chat.lastCleared < twentyFourHoursAgo) {
      console.log('🧹 Auto-clearing chat before adding new message');
      chat.messages = [];
      chat.lastCleared = new Date();
      await chat.addSystemMessage('Chat history has been automatically cleared.');
    }

    const message = {
      sender: req.user._id,
      content: content.trim(),
      timestamp: new Date(),
      messageType: 'text'
    };

    chat.messages.push(message);
    chat.updatedAt = new Date();
    
    // Update user's last seen
    const existingUserIndex = chat.activeUsers.findIndex(
      user => user.userId && user.userId.toString() === req.user._id.toString()
    );
    
    if (existingUserIndex >= 0) {
      chat.activeUsers[existingUserIndex].lastSeen = new Date();
    } else {
      chat.activeUsers.push({
        userId: req.user._id,
        lastSeen: new Date()
      });
    }
    
    await chat.save();

    // Populate sender info for the response
    await chat.populate('messages.sender', 'name email role');
    const populatedMessage = chat.messages[chat.messages.length - 1];

    console.log('✅ Message saved, broadcasting to all users');

    // Emit real-time message to ALL connected users (public chat)
    const io = req.app.get('io');
    if (io) {
      io.emit('new_message', {
        ...populatedMessage.toObject(),
        chatId: req.params.chatId
      });
    }

    res.json(populatedMessage);
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear chat history manually (admin only)
router.post('/:chatId/clear', authenticateToken, async (req, res) => {
  try {
    // Only allow admin to manually clear chat
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can manually clear chat' });
    }

    console.log('🧹 Admin manually clearing chat:', req.params.chatId);
    
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const messageCount = chat.messages.length;
    chat.messages = [];
    chat.lastCleared = new Date();
    await chat.save();
    
    // Add system message about manual clear
    await chat.addSystemMessage(`Chat history cleared by admin: ${req.user.name}`);

    console.log(`✅ Chat cleared by admin, removed ${messageCount} messages`);

    // Notify all users that chat was cleared
    const io = req.app.get('io');
    if (io) {
      io.emit('chat_cleared', {
        chatId: req.params.chatId,
        clearedAt: chat.lastCleared,
        clearedBy: req.user.name
      });
    }

    res.json({ 
      message: 'Chat cleared successfully',
      messagesRemoved: messageCount,
      clearedAt: chat.lastCleared
    });
  } catch (error) {
    console.error('❌ Error clearing chat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user activity (heartbeat)
router.post('/:chatId/heartbeat', authenticateToken, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Update user's last seen
    const existingUserIndex = chat.activeUsers.findIndex(
      user => user.userId && user.userId.toString() === req.user._id.toString()
    );
    
    if (existingUserIndex >= 0) {
      chat.activeUsers[existingUserIndex].lastSeen = new Date();
    } else {
      chat.activeUsers.push({
        userId: req.user._id,
        lastSeen: new Date()
      });
    }
    
    // Clean up inactive users (not seen in last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    chat.activeUsers = chat.activeUsers.filter(user => 
      new Date(user.lastSeen) > thirtyMinutesAgo
    );
    
    await chat.save();

    res.json({ 
      activeUserCount: chat.activeUsers.length,
      lastSeen: new Date()
    });
  } catch (error) {
    console.error('❌ Error updating heartbeat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;