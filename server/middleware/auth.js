import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Access token required' });
    }

    // Get JWT secret from environment variables
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET not found in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    console.log('Verifying token...');
    const decoded = jwt.verify(token, jwtSecret);
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('User not found for token');
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    console.log('Token verified for user:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired' });
    }
    
    return res.status(403).json({ message: 'Token verification failed' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      console.log(`Access denied. User role: ${req.user.role}, Required roles: ${roles.join(', ')}`);
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }
    
    console.log(`Access granted for role: ${req.user.role}`);
    next();
  };
};

export const requireApproval = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (!req.user.isApproved) {
    console.log(`Access denied. User ${req.user.email} not approved`);
    return res.status(403).json({ 
      message: 'Account pending approval. Please contact administrator.' 
    });
  }
  
  console.log(`Approval check passed for user: ${req.user.email}`);
  next();
};