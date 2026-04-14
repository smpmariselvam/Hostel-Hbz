import express from 'express';
import Food from '../models/Food.js';
import FoodOrder from '../models/FoodOrder.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all food items (public)
router.get('/', async (req, res) => {
  try {
    const { category, isVegetarian } = req.query;
    
    let filter = { isAvailable: true };
    
    if (category) filter.category = category;
    if (isVegetarian !== undefined) filter.isVegetarian = isVegetarian === 'true';

    const foods = await Food.find(filter);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add food item (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update food item (admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete food item (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create food order (customer only)
router.post('/orders', authenticateToken, authorizeRoles('customer'), async (req, res) => {
  try {
    const { items, deliveryLocation, specialInstructions } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res.status(404).json({ message: `Food item not found: ${item.foodId}` });
      }
      
      const itemTotal = food.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        food: food._id,
        quantity: item.quantity,
        price: itemTotal
      });
    }

    const order = new FoodOrder({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryLocation,
      specialInstructions
    });

    await order.save();
    await order.populate('items.food customer');

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user food orders (customer)
router.get('/orders/my-orders', authenticateToken, authorizeRoles('customer'), async (req, res) => {
  try {
    const orders = await FoodOrder.find({ customer: req.user._id })
      .populate('items.food', 'name price image')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all food orders (admin/staff)
router.get('/orders', authenticateToken, authorizeRoles('admin', 'staff'), async (req, res) => {
  try {
    const orders = await FoodOrder.find()
      .populate('customer', 'name email phone')
      .populate('items.food', 'name price')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update food order status (admin/staff)
router.put('/orders/:id/status', authenticateToken, authorizeRoles('admin', 'staff'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await FoodOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer items.food');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;