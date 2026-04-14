import express from 'express';
import QRCode from 'qrcode';
import Booking from '../models/Booking.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Generate payment QR code
router.post('/generate-qr', authenticateToken, async (req, res) => {
  try {
    const { bookingId, amount, method } = req.body;

    // Create payment data
    const paymentData = {
      bookingId,
      amount,
      method,
      userId: req.user._id,
      timestamp: new Date().toISOString()
    };

    // Generate QR code
    const qrCode = await QRCode.toDataURL(JSON.stringify(paymentData));

    res.json({
      qrCode,
      paymentData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Process payment
router.post('/process', authenticateToken, async (req, res) => {
  try {
    const { bookingId, paymentMethod, amount } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking payment status
    booking.paymentStatus = 'paid';
    booking.paymentMethod = paymentMethod;
    await booking.save();

    res.json({
      message: 'Payment processed successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;