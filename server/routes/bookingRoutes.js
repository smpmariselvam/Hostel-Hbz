import express from 'express';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Create booking (customer only)
router.post('/', authenticateToken, authorizeRoles('customer'), async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, specialRequests } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.isAvailable) {
      return res.status(400).json({ message: 'Room not available' });
    }

    // Check for existing bookings in the date range
    const existingBooking = await Booking.findOne({
      room: roomId,
      status: { $nin: ['cancelled', 'checked-out'] },
      $or: [
        {
          checkIn: { $lte: new Date(checkIn) },
          checkOut: { $gt: new Date(checkIn) }
        },
        {
          checkIn: { $lt: new Date(checkOut) },
          checkOut: { $gte: new Date(checkOut) }
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Room not available for selected dates' });
    }

    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalAmount = room.price * nights;

    const booking = new Booking({
      customer: req.user._id,
      room: roomId,
      checkIn,
      checkOut,
      guests,
      totalAmount,
      specialRequests
    });

    await booking.save();
    await booking.populate('room customer', 'name roomNumber');

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user bookings (customer)
router.get('/my-bookings', authenticateToken, authorizeRoles('customer'), async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('room', 'name roomNumber type images price')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all bookings (admin/staff)
router.get('/', authenticateToken, authorizeRoles('admin', 'staff'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'name email phone')
      .populate('room', 'name roomNumber type')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update booking status (admin/staff)
router.put('/:id/status', authenticateToken, authorizeRoles('admin', 'staff'), async (req, res) => {
  try {
    const { status } = req.body;
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking (customer)
router.put('/:id/cancel', authenticateToken, authorizeRoles('customer'), async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      customer: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'checked-in') {
      return res.status(400).json({ message: 'Cannot cancel after check-in' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;