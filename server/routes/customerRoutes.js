import express from 'express';
import Booking from '../models/Booking.js';
import FoodOrder from '../models/FoodOrder.js';
import User from '../models/User.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get customer dashboard with accurate total spent calculation
router.get('/dashboard', authenticateToken, authorizeRoles('customer'), async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('room', 'name roomNumber type images')
      .sort({ createdAt: -1 })
      .limit(5);

    const foodOrders = await FoodOrder.find({ customer: req.user._id })
      .populate('items.food', 'name price image')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate accurate total spent from all sources
    const bookingSpent = await Booking.aggregate([
      { $match: { customer: req.user._id, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const foodSpent = await FoodOrder.aggregate([
      { $match: { customer: req.user._id, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalBookingSpent = bookingSpent[0]?.total || 0;
    const totalFoodSpent = foodSpent[0]?.total || 0;
    const totalSpent = totalBookingSpent + totalFoodSpent;

    res.json({
      recentBookings: bookings,
      recentFoodOrders: foodOrders,
      totalSpent,
      totalBookingSpent,
      totalFoodSpent
    });
  } catch (error) {
    console.error('Customer dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update customer profile
router.put('/profile', authenticateToken, authorizeRoles('customer'), async (req, res) => {
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
    console.error('Update customer profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change customer password
router.put('/change-password', authenticateToken, authorizeRoles('customer'), async (req, res) => {
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
    console.error('Change customer password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;