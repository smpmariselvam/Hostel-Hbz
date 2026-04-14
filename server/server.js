import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const server = createServer(app);

// Get CORS origins from environment variables
const CORS_ORIGIN = process.env.CORS_ORIGIN || "https://hostel-hbz.onrender.com";
const SOCKET_CORS_ORIGIN = process.env.SOCKET_CORS_ORIGIN || "https://hostel-hbz.onrender.com";

console.log('🔒 CORS Origin:', CORS_ORIGIN);
console.log('🔒 Socket CORS Origin:', SOCKET_CORS_ORIGIN);

const io = new Server(server, {
  cors: {
    origin: SOCKET_CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"]
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Debug middleware to log all requests - MUST be before routes
app.use((req, res, next) => {
  console.log(`\n🌐 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  console.log('Headers:', req.headers.authorization ? 'Has Auth Token' : 'No Auth Token');
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  if (req.query && Object.keys(req.query).length > 0) {
    console.log('Query:', req.query);
  }
  next();
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Socket.io connection handling for public chat
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  // Join public chat room
  socket.on('join_public_chat', (chatId) => {
    socket.join('public_chat');
    console.log(`👥 User ${socket.id} joined public chat`);
    
    // Notify others that a user joined
    socket.to('public_chat').emit('user_joined_chat', {
      userId: socket.id,
      timestamp: new Date()
    });
  });

  // Handle joining notification rooms
  socket.on('join_notifications', (userId) => {
    socket.join(userId);
    console.log(`🔔 User ${socket.id} joined notifications for user ${userId}`);
  });

  // Handle private room joining (for other features)
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`🏠 User ${socket.id} joined room ${roomId}`);
  });

  // Handle private messages (for other features)
  socket.on('send_message', (data) => {
    console.log('💬 Private message received:', data);
    socket.to(data.room).emit('receive_message', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
    
    // Notify others that a user left
    socket.to('public_chat').emit('user_left_chat', {
      userId: socket.id,
      timestamp: new Date()
    });
  });
});

// Make io accessible to routes
app.set('io', io);

// Routes - IMPORTANT: Order matters!
console.log('\n🚀 Setting up routes...');

app.use('/api/auth', authRoutes);
console.log('✅ Auth routes mounted at /api/auth');

app.use('/api/rooms', roomRoutes);
console.log('✅ Room routes mounted at /api/rooms');

app.use('/api/bookings', bookingRoutes);
console.log('✅ Booking routes mounted at /api/bookings');

app.use('/api/food', foodRoutes);
console.log('✅ Food routes mounted at /api/food');

app.use('/api/admin', adminRoutes);
console.log('✅ Admin routes mounted at /api/admin (includes /api/admin/complaints)');

app.use('/api/staff', staffRoutes);
console.log('✅ Staff routes mounted at /api/staff');

app.use('/api/customer', customerRoutes);
console.log('✅ Customer routes mounted at /api/customer');

app.use('/api/chat', chatRoutes);
console.log('✅ Chat routes mounted at /api/chat');

app.use('/api/payments', paymentRoutes);
console.log('✅ Payment routes mounted at /api/payments');

app.use('/api/complaints', complaintRoutes);
console.log('✅ Complaint routes mounted at /api/complaints');

app.use('/api/notifications', notificationRoutes);
console.log('✅ Notification routes mounted at /api/notifications');

console.log('🎉 All routes setup complete!\n');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  console.log('Available routes:');
  console.log('  - GET /api/chat/public-chat');
  console.log('  - GET /api/chat/:id/messages');
  console.log('  - POST /api/chat/:id/messages');
  console.log('  - POST /api/chat/:id/clear');
  
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET /api/chat/public-chat',
      'GET /api/chat/:id/messages',
      'POST /api/chat/:id/messages',
      'POST /api/chat/:id/clear'
    ]
  });
});

const PORT = process.env.PORT || "https://hostel-hbz.onrender.com";
server.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🗄️ MongoDB URI: ${process.env.MONGO_URI ? 'Connected' : 'Not configured'}`);
  console.log(`🔒 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}`);
  console.log(`🌐 CORS Origin: ${CORS_ORIGIN}`);
  console.log(`🔌 Socket CORS Origin: ${SOCKET_CORS_ORIGIN}`);
  console.log('\n📋 Available API endpoints:');
  console.log('  🔐 /api/auth/* - Authentication');
  console.log('  🏨 /api/rooms/* - Room management');
  console.log('  📅 /api/bookings/* - Booking management');
  console.log('  🍽️ /api/food/* - Food menu');
  console.log('  👑 /api/admin/* - Admin panel (includes complaints)');
  console.log('  👨‍🔧 /api/staff/* - Staff operations');
  console.log('  👤 /api/customer/* - Customer operations');
  console.log('  💬 /api/chat/* - Public Chat system');
  console.log('  💳 /api/payments/* - Payment processing');
  console.log('  📝 /api/complaints/* - Complaint system');
  console.log('  🔔 /api/notifications/* - Notifications');
  console.log('\n🌐 Public Chat Features:');
  console.log('  📱 GET /api/chat/public-chat - Initialize public chat');
  console.log('  📨 GET /api/chat/:id/messages - Get chat messages');
  console.log('  💬 POST /api/chat/:id/messages - Send message');
  console.log('  🧹 POST /api/chat/:id/clear - Clear chat (admin only)');
  console.log('  📊 GET /api/chat/:id/stats - Chat statistics (admin only)');
  console.log('\n✅ Server ready for requests!\n');
});