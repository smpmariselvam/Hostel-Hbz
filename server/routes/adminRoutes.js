import express from 'express';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import FoodOrder from '../models/FoodOrder.js';
import Food from '../models/Food.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

console.log('🔧 Loading Admin Routes...');

// Test route for admin
router.get('/test', authenticateToken, authorizeRoles('admin'), (req, res) => {
  console.log('✅ Admin test route accessed by:', req.user.email);
  res.json({ 
    message: 'Admin routes working perfectly!',
    user: req.user.email,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /api/admin/dashboard',
      'GET /api/admin/complaints',
      'PUT /api/admin/complaints/:id/status',
      'PUT /api/admin/complaints/:id/respond',
      'DELETE /api/admin/complaints/:id'
    ]
  });
});

// Get dashboard stats with accurate revenue calculation
router.get('/dashboard', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    console.log('📊 Admin dashboard request from:', req.user.email);
    
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ 
      status: { $in: ['confirmed', 'checked-in'] } 
    });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalStaff = await User.countDocuments({ role: 'staff' });
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'available' });
    const pendingStaff = await User.countDocuments({ 
      role: 'staff', 
      isApproved: false 
    });
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });

    // Calculate total earnings from all sources
    const bookingRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const foodRevenue = await FoodOrder.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalBookingRevenue = bookingRevenue[0]?.total || 0;
    const totalFoodRevenue = foodRevenue[0]?.total || 0;
    const totalEarnings = totalBookingRevenue + totalFoodRevenue;

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('customer', 'name email phone')
      .populate('room', 'name roomNumber type')
      .populate('assignedStaff', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Recent food orders
    const recentFoodOrders = await FoodOrder.find()
      .populate('customer', 'name email')
      .populate('items.food', 'name price')
      .populate('assignedStaff', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent complaints
    const recentComplaints = await Complaint.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const stats = {
      totalBookings,
      activeBookings,
      totalCustomers,
      totalStaff,
      totalRooms,
      availableRooms,
      pendingStaff,
      totalComplaints,
      pendingComplaints,
      totalEarnings,
      totalBookingRevenue,
      totalFoodRevenue,
      occupancyRate: totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0
    };

    console.log('📊 Dashboard stats calculated:', stats);

    res.json({
      stats,
      recentBookings,
      recentFoodOrders,
      recentComplaints
    });
  } catch (error) {
    console.error('❌ Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all complaints with filtering and pagination - FIXED ROUTE
router.get('/complaints', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    console.log('\n=== 📝 ADMIN COMPLAINTS REQUEST ===');
    console.log('👑 Admin user:', req.user.email);
    console.log('🔍 Query params:', req.query);
    console.log('🌐 Request URL:', req.originalUrl);
    console.log('📡 Request method:', req.method);
    
    const { 
      page = 1, 
      limit = 10, 
      status, 
      category, 
      priority, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    console.log('🔍 Filter applied:', filter);
    console.log('📊 Sort applied:', sortObj);
    console.log('📄 Pagination: page', page, 'limit', limit);

    // First, let's check if we have any complaints at all
    const totalComplaintsInDB = await Complaint.countDocuments();
    console.log('📊 Total complaints in database:', totalComplaintsInDB);

    if (totalComplaintsInDB === 0) {
      console.log('⚠️ No complaints found in database - creating sample data...');
      
      // Create some sample complaints for testing
      const sampleComplaints = [
        {
          customer: '507f1f77bcf86cd799439011', // This should be a valid customer ID
          title: 'Room Air Conditioning Issue',
          description: 'The air conditioning in my room is not working properly. It makes loud noises and does not cool the room effectively.',
          category: 'room',
          priority: 'high',
          status: 'pending'
        },
        {
          customer: '507f1f77bcf86cd799439011',
          title: 'Slow Room Service',
          description: 'I ordered room service 2 hours ago and it still has not arrived. This is very disappointing.',
          category: 'service',
          priority: 'medium',
          status: 'in-progress',
          response: 'We apologize for the delay. Your order is being prepared now and will be delivered within 15 minutes.',
          respondedAt: new Date()
        },
        {
          customer: '507f1f77bcf86cd799439011',
          title: 'Billing Error',
          description: 'I was charged twice for the same room service order on my bill. Please correct this error.',
          category: 'billing',
          priority: 'high',
          status: 'resolved',
          response: 'We have reviewed your bill and corrected the duplicate charge. A refund has been processed.',
          respondedAt: new Date()
        }
      ];

      try {
        await Complaint.insertMany(sampleComplaints);
        console.log('✅ Sample complaints created successfully');
      } catch (sampleError) {
        console.log('⚠️ Could not create sample complaints:', sampleError.message);
      }
    }

    const complaints = await Complaint.find(filter)
      .populate('customer', 'name email phone')
      .populate('assignedStaff', 'name email')
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    console.log(`✅ Found ${complaints.length} complaints out of ${total} total`);
    console.log('📋 Complaint IDs:', complaints.map(c => c._id.toString().slice(-6)));
    
    // Log each complaint for debugging
    complaints.forEach((complaint, index) => {
      console.log(`📝 Complaint ${index + 1}:`, {
        id: complaint._id.toString().slice(-6),
        title: complaint.title,
        status: complaint.status,
        priority: complaint.priority,
        category: complaint.category,
        customer: complaint.customer?.name || 'No customer data'
      });
    });
    
    console.log('=== 📝 ADMIN COMPLAINTS RESPONSE ===\n');

    res.json({
      complaints,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      total,
      success: true
    });
  } catch (error) {
    console.error('❌ Get complaints error:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      success: false
    });
  }
});

// Update complaint status
router.put('/complaints/:id/status', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`🔄 Updating complaint ${req.params.id} status to:`, status);
    
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer assignedStaff');

    if (!complaint) {
      console.log('❌ Complaint not found:', req.params.id);
      return res.status(404).json({ message: 'Complaint not found' });
    }

    console.log('✅ Complaint status updated successfully');
    res.json(complaint);
  } catch (error) {
    console.error('❌ Update complaint status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Respond to complaint
router.put('/complaints/:id/respond', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { response } = req.body;
    console.log(`💬 Admin responding to complaint ${req.params.id}`);
    
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        response,
        respondedAt: new Date(),
        status: 'resolved' // Admin can mark as resolved
      },
      { new: true }
    ).populate('customer assignedStaff');

    if (!complaint) {
      console.log('❌ Complaint not found:', req.params.id);
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Create notification for customer
    const notification = new Notification({
      sender: req.user._id,
      recipient: complaint.customer._id,
      title: 'Complaint Response',
      message: `Your complaint "${complaint.title}" has been resolved. Please check the response.`,
      type: 'alert',
      priority: 'medium'
    });
    
    await notification.save();
    
    // Emit real-time notification if socket.io is available
    const io = req.app.get('io');
    if (io) {
      io.to(complaint.customer._id.toString()).emit('notification', notification);
    }

    console.log('✅ Complaint response sent successfully');
    res.json(complaint);
  } catch (error) {
    console.error('❌ Respond to complaint error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign staff to complaint
router.put('/complaints/:id/assign-staff', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { staffId } = req.body;
    
    const staff = await User.findOne({ _id: staffId, role: 'staff', isApproved: true });
    if (!staff) {
      return res.status(400).json({ message: 'Invalid or unapproved staff member' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedStaff: staffId },
      { new: true }
    ).populate('assignedStaff customer');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Assign staff to complaint error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete complaint
router.delete('/complaints/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    console.log(`🗑️ Admin deleting complaint ${req.params.id}`);
    
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      console.log('❌ Complaint not found:', req.params.id);
      return res.status(404).json({ message: 'Complaint not found' });
    }

    console.log('✅ Complaint deleted successfully');
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('❌ Delete complaint error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get payment history
router.get('/payment-history', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;

    let bookingPayments = [];
    let foodPayments = [];

    if (!type || type === 'booking') {
      bookingPayments = await Booking.find({ paymentStatus: 'paid' })
        .populate('customer', 'name email')
        .populate('room', 'name roomNumber')
        .sort({ updatedAt: -1 })
        .limit(type === 'booking' ? limit * 1 : 10);
    }

    if (!type || type === 'food') {
      foodPayments = await FoodOrder.find({ status: 'delivered' })
        .populate('customer', 'name email')
        .populate('items.food', 'name')
        .sort({ updatedAt: -1 })
        .limit(type === 'food' ? limit * 1 : 10);
    }

    // Calculate totals
    const bookingTotal = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
    ]);

    const foodTotal = await FoodOrder.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
    ]);

    res.json({
      bookingPayments,
      foodPayments,
      totals: {
        booking: {
          amount: bookingTotal[0]?.total || 0,
          count: bookingTotal[0]?.count || 0
        },
        food: {
          amount: foodTotal[0]?.total || 0,
          count: foodTotal[0]?.count || 0
        },
        overall: {
          amount: (bookingTotal[0]?.total || 0) + (foodTotal[0]?.total || 0),
          count: (bookingTotal[0]?.count || 0) + (foodTotal[0]?.count || 0)
        }
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update admin profile
router.put('/profile', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, address },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change admin password
router.put('/change-password', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create notification for users
router.post('/notifications', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { recipient, title, message, type, priority } = req.body;

    const notification = new Notification({
      sender: req.user._id,
      recipient,
      title,
      message,
      type,
      priority
    });

    await notification.save();
    await notification.populate('sender recipient', 'name email role');

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(recipient).emit('notification', notification);
    }

    res.status(201).json(notification);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all notifications (admin view)
router.get('/notifications', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find()
      .populate('sender recipient', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments();

    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update notification
router.put('/notifications/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { title, message, type, priority } = req.body;
    
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { title, message, type, priority },
      { new: true }
    ).populate('sender recipient', 'name email role');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete notification
router.delete('/notifications/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users with pagination and filtering
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, approval } = req.query;
    
    let filter = {};
    
    if (role) filter.role = role;
    if (approval !== undefined) filter.isApproved = approval === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve/reject staff
router.put('/users/:id/approval', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { isApproved } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User ${user.email} approval status changed to:`, isApproved);
    res.json(user);
  } catch (error) {
    console.error('User approval error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user role
router.put('/users/:id/role', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['customer', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isApproved: role === 'customer' || role === 'admin' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log(`User ${user.email} deleted by admin:`, req.user.email);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bookings with filtering
router.get('/bookings', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    
    if (search) {
      // Get customer IDs that match the search
      const customers = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const customerIds = customers.map(c => c._id);
      
      filter.$or = [
        { customer: { $in: customerIds } }
      ];
    }
    
    const bookings = await Booking.find(filter)
      .populate('customer', 'name email phone')
      .populate('room', 'name roomNumber type')
      .populate('assignedStaff', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status
router.put('/bookings/:id/status', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer room assignedStaff');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign staff to booking
router.put('/bookings/:id/assign-staff', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { staffId } = req.body;
    
    // Verify staff exists and is approved
    const staff = await User.findOne({ _id: staffId, role: 'staff', isApproved: true });
    if (!staff) {
      return res.status(400).json({ message: 'Invalid or unapproved staff member' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { assignedStaff: staffId },
      { new: true }
    ).populate('assignedStaff customer room');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Assign staff error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all rooms with filtering
router.get('/rooms', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, search } = req.query;
    
    let filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { roomNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const rooms = await Room.find(filter)
      .sort({ roomNumber: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Room.countDocuments(filter);

    res.json({
      rooms,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new room
router.post('/rooms', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    
    console.log(`New room created by admin ${req.user.email}:`, room.roomNumber);
    res.status(201).json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update room
router.put('/rooms/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete room
router.delete('/rooms/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    // Check if room has active bookings
    const activeBookings = await Booking.countDocuments({
      room: req.params.id,
      status: { $in: ['confirmed', 'checked-in'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete room with active bookings' 
      });
    }

    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all food items
router.get('/food', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const foods = await Food.find(filter)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Food.countDocuments(filter);

    res.json({
      foods,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get food items error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new food item
router.post('/food', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    
    console.log(`New food item created by admin ${req.user.email}:`, food.name);
    res.status(201).json(food);
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update food item
router.put('/food/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json(food);
  } catch (error) {
    console.error('Update food error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete food item
router.delete('/food/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all food orders
router.get('/food-orders', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    
    if (search) {
      // Get customer IDs that match the search
      const customers = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const customerIds = customers.map(c => c._id);
      
      filter.$or = [
        { customer: { $in: customerIds } },
        { deliveryLocation: { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await FoodOrder.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.food', 'name price')
      .populate('assignedStaff', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await FoodOrder.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get food orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update food order status
router.put('/food-orders/:id/status', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await FoodOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer items.food assignedStaff');

    if (!order) {
      return res.status(404).json({ message: 'Food order not found' });
    }

    // If the order is approved (status changed to preparing), update payment status
    if (status === 'preparing') {
      // You could add a paymentStatus field to FoodOrder model if needed
      // For now, just changing the status is enough to indicate payment approval
      
      // Create a notification for the customer
      const notification = new Notification({
        sender: req.user._id,
        recipient: order.customer._id,
        title: 'Food Order Payment Approved',
        message: `Your payment for order #${order._id.toString().slice(-8)} has been approved and is now being prepared.`,
        type: 'order',
        priority: 'medium'
      });
      
      await notification.save();
      
      // Emit real-time notification if socket.io is available
      const io = req.app.get('io');
      if (io) {
        io.to(order.customer._id.toString()).emit('notification', notification);
      }
    }

    // If the order is rejected (status changed to cancelled)
    if (status === 'cancelled') {
      // Create a notification for the customer
      const notification = new Notification({
        sender: req.user._id,
        recipient: order.customer._id,
        title: 'Food Order Payment Rejected',
        message: `Your payment for order #${order._id.toString().slice(-8)} has been rejected. Please contact support for assistance.`,
        type: 'order',
        priority: 'high'
      });
      
      await notification.save();
      
      // Emit real-time notification if socket.io is available
      const io = req.app.get('io');
      if (io) {
        io.to(order.customer._id.toString()).emit('notification', notification);
      }
    }

    res.json(order);
  } catch (error) {
    console.error('Update food order status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign staff to food order
router.put('/food-orders/:id/assign-staff', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { staffId } = req.body;
    
    const staff = await User.findOne({ _id: staffId, role: 'staff', isApproved: true });
    if (!staff) {
      return res.status(400).json({ message: 'Invalid or unapproved staff member' });
    }

    const order = await FoodOrder.findByIdAndUpdate(
      req.params.id,
      { assignedStaff: staffId },
      { new: true }
    ).populate('assignedStaff customer items.food');

    if (!order) {
      return res.status(404).json({ message: 'Food order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Assign staff to food order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get analytics data
router.get('/analytics', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Revenue analytics
    const revenueData = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Room type analytics
    const roomTypeData = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'rooms',
          localField: 'room',
          foreignField: '_id',
          as: 'roomData'
        }
      },
      {
        $group: {
          _id: "$roomData.type",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Customer analytics
    const customerData = await User.aggregate([
      {
        $match: {
          role: 'customer',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          newCustomers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      revenue: revenueData,
      roomTypes: roomTypeData,
      customers: customerData
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get staff list for assignments
router.get('/staff', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const staff = await User.find({ 
      role: 'staff', 
      isApproved: true 
    }).select('name email phone');

    res.json(staff);
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

console.log('✅ Admin Routes loaded successfully with complaints endpoint at /complaints');

export default router;