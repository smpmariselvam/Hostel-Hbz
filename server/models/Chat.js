import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  // Remove participants array since it's now a public chat
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    },
    messageType: {
      type: String,
      enum: ['text', 'system'],
      default: 'text'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  // Add field to track when chat was last cleared
  lastCleared: {
    type: Date,
    default: Date.now
  },
  // Track active users
  activeUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastSeen: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient querying of recent messages
chatSchema.index({ 'messages.timestamp': -1 });
chatSchema.index({ lastCleared: 1 });
chatSchema.index({ 'activeUsers.userId': 1 });

// Method to clean old messages
chatSchema.methods.cleanOldMessages = function() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  this.messages = this.messages.filter(message => 
    new Date(message.timestamp) > twentyFourHoursAgo
  );
  return this.save();
};

// Method to add system message
chatSchema.methods.addSystemMessage = function(content) {
  this.messages.push({
    sender: mongoose.Types.ObjectId('000000000000000000000000'), // Use a placeholder ObjectId for system messages
    content,
    messageType: 'system',
    timestamp: new Date()
  });
  return this.save();
};

export default mongoose.model('Chat', chatSchema);