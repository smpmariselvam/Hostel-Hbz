import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth routes working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set'
  });
});

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Register request received:', {
      ...req.body,
      password: '[HIDDEN]'
    });
    
    const { name, email, password, role, phone, address } = req.body;

    // Validation
    if (!name || !email || !password || !phone) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: 'Please provide all required fields: name, email, password, phone' 
      });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ 
        message: 'User already exists with this email' 
      });
    }

    // Create new user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'customer',
      phone: phone.trim(),
      address: address?.trim() || ''
    };

    const user = new User(userData);
    await user.save();
    
    console.log('User created successfully:', user.email);

    // Get JWT secret from environment variables
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET not found in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: messages.join(', ')
      });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already exists' 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('\n=== LOGIN REQUEST START ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Request body:', { 
      email: req.body.email,
      hasPassword: !!req.body.password,
      passwordLength: req.body.password?.length
    });
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    const searchEmail = email.toLowerCase().trim();
    console.log('🔍 Searching for user with email:', searchEmail);

    // Find user by email
    const user = await User.findOne({ email: searchEmail });
    
    if (!user) {
      console.log('❌ User not found for email:', searchEmail);
      
      // Check if any users exist
      const userCount = await User.countDocuments();
      console.log('Total users in database:', userCount);
      
      // List all users for debugging
      const allUsers = await User.find({}, 'email role').limit(10);
      console.log('Existing users:', allUsers.map(u => ({ email: u.email, role: u.role })));
      
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    console.log('✅ User found:', {
      id: user._id,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      hasPassword: !!user.password,
      passwordLength: user.password?.length,
      createdAt: user.createdAt
    });

    // Check password
    console.log('🔐 Starting password comparison...');
    
    // Test direct bcrypt comparison with proper import
    console.log('Testing bcrypt.compare function...');
    
    if (typeof bcrypt.compare !== 'function') {
      console.error('❌ bcrypt.compare is not a function!');
      console.log('Available bcrypt methods:', Object.keys(bcrypt));
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    const directMatch = await bcrypt.compare(password, user.password);
    console.log('Direct bcrypt comparison result:', directMatch);
    
    // Test user method
    const methodMatch = await user.comparePassword(password);
    console.log('User method comparison result:', methodMatch);
    
    if (!directMatch && !methodMatch) {
      console.log('❌ Password mismatch for user:', email);
      
      // Additional debugging
      console.log('Trying to hash the input password to compare...');
      const testHash = await bcrypt.hash(password, 12);
      console.log('Test hash of input password:', testHash);
      
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    console.log('✅ Password verified successfully');

    // Get JWT secret from environment variables
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET not set!');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign(
      { userId: user._id },
      jwtSecret,
      { expiresIn: '7d' }
    );

    console.log('✅ JWT token generated successfully');

    const responseData = {
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isApproved: user.isApproved
      }
    };

    console.log('✅ Sending successful response:', {
      ...responseData,
      token: '[HIDDEN]'
    });
    console.log('=== LOGIN REQUEST END ===\n');

    res.json(responseData);
  } catch (error) {
    console.error('\n=== LOGIN ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== LOGIN ERROR END ===\n');
    
    res.status(500).json({ 
      message: 'Server error during login', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    console.log('Get user request for:', req.user.email);
    
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isApproved: req.user.isApproved,
        phone: req.user.phone,
        address: req.user.address
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;