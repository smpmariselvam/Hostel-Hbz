import express from 'express';
import Complaint from '../models/Complaint.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Create complaint (customer only)
router.post('/', authenticateToken, authorizeRoles('customer'), async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const complaint = new Complaint({
      customer: req.user._id,
      title,
      description,
      category,
      priority
    });

    await complaint.save();
    await complaint.populate('customer', 'name email phone');

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user complaints (customer)
router.get('/my-complaints', authenticateToken, authorizeRoles('customer'), async (req, res) => {
  try {
    const complaints = await Complaint.find({ customer: req.user._id })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(complaints);
  } catch (error) {
    console.error('Get user complaints error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all complaints (admin/staff)
router.get('/', authenticateToken, authorizeRoles('admin', 'staff'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const complaints = await Complaint.find(filter)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update complaint status (admin/staff)
router.put('/:id/status', authenticateToken, authorizeRoles('admin', 'staff'), async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Respond to complaint (admin/staff)
router.put('/:id/respond', authenticateToken, authorizeRoles('admin', 'staff'), async (req, res) => {
  try {
    const { response } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        response,
        respondedAt: new Date(),
        status: req.user.role === 'admin' ? 'resolved' : 'in-progress'
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

export default router;