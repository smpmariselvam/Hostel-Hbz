import express from 'express';
import Booking from '../models/Booking.js';
import FoodOrder from '../models/FoodOrder.js';
import Room from '../models/Room.js';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import { authenticateToken, authorizeRoles, requireApproval } from '../middleware/auth.js';

const router = express.Router();

// Get staff dashboard
router.get('/dashboard', authenticateToken, authorizeRoles('staff'), requireApproval, async (req, res) => {
  try {
    const assignedBookings = await Booking.find({ assignedStaff: req.user._id })
      .populate('customer', 'name email phone')
      .populate('room', 'name roomNumber')
      .sort({ createdAt: -1 });

    const assignedFoodOrders = await FoodOrder.find({ assignedStaff: req.user._id })
      .populate('customer', 'name email phone')
      .populate('items.food', 'name price')
      .sort({ createdAt: -1 });

    const roomsToClean = await Room.find({ status: 'cleaning' });

    // Get pending complaints that staff can respond to
    const pendingComplaints = await Complaint.find({ 
      status: { $in: ['pending', 'in-progress'] }
    })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get all bookings that need attention
    const pendingBookings = await Booking.find({ 
      status: { $in: ['pending', 'confirmed'] }
    })
      .populate('customer', 'name email phone')
      .populate('room', 'name roomNumber')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get all food orders that need attention
    const pendingFoodOrders = await FoodOrder.find({ 
      status: { $in: ['pending', 'preparing'] }
    })
      .populate('customer', 'name email phone')
      .populate('items.food', 'name price')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      assignedBookings,
      assignedFoodOrders,
      roomsToClean,
      pendingComplaints,
      pendingBookings,
      pendingFoodOrders
    });
  } catch (error) {
    console.error('Staff dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update room status
router.put('/rooms/:id/status', authenticateToken, authorizeRoles('staff'), requireApproval, async (req, res) => {
  try {
    const { status } = req.body;
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    console.error('Update room status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status (limited staff permissions)
router.put('/bookings/:id/status', authenticateToken, authorizeRoles('staff'), requireApproval, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Staff can only update to certain statuses
    const allowedStatuses = ['confirmed', 'checked-in', 'checked-out'];
    if (!allowedStatuses.includes(status)) {
      return res.status(403).json({ message: 'Not authorized to set this status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer room');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update food order status (limited staff permissions)
router.put('/food-orders/:id/status', authenticateToken, authorizeRoles('staff'), requireApproval, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Staff can only update to certain statuses
    const allowedStatuses = ['preparing', 'ready', 'delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(403).json({ message: 'Not authorized to set this status' });
    }

    const order = await FoodOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer items.food');

    if (!order) {
      return res.status(404).json({ message: 'Food order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Update food order status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Respond to complaint (staff can respond but not change status to resolved)
router.put('/complaints/:id/respond', authenticateToken, authorizeRoles('staff'), requireApproval, async (req, res) => {
  try {
    const { response } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        response,
        respondedAt: new Date(),
        status: 'in-progress' // Staff can only mark as in-progress, not resolved
      },
      { new: true }
    ).populate('customer');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Respond to complaint error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update staff profile
router.put('/profile', authenticateToken, authorizeRoles('staff'), async (req, res) => {
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
    console.error('Update staff profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change staff password
router.put('/change-password', authenticateToken, authorizeRoles('staff'), async (req, res) => {
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
    console.error('Change staff password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;