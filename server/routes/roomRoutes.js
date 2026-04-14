import express from 'express';
import Room from '../models/Room.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all rooms (public)
router.get('/', async (req, res) => {
  try {
    const { type, minPrice, maxPrice, capacity, available } = req.query;
    
    let filter = {};
    
    if (type) filter.type = type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (capacity) filter.capacity = { $gte: Number(capacity) };
    if (available !== undefined) filter.isAvailable = available === 'true';

    const rooms = await Room.find(filter).populate('reviews.user', 'name');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single room (public)
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('reviews.user', 'name');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add room (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update room (admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete room (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add room review (customer only)
router.post('/:id/review', authenticateToken, authorizeRoles('customer'), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const review = {
      user: req.user._id,
      rating,
      comment
    };

    room.reviews.push(review);
    
    // Calculate average rating
    const totalRating = room.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    room.rating = totalRating / room.reviews.length;

    await room.save();
    res.json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;