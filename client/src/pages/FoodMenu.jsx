import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Plus, 
  Minus,
  Clock,
  Leaf,
  Star
} from 'lucide-react';

const FoodMenu = () => {
  const { isAuthenticated, hasRole } = useAuth();
  const { addToCart, getCartItem, updateQuantity } = useCart();
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    isVegetarian: '',
    search: ''
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [foods, filters]);

  const fetchFoods = async () => {
    try {
      const response = await axios.get('/api/food');
      setFoods(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching foods:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...foods];

    if (filters.category) {
      filtered = filtered.filter(food => food.category === filters.category);
    }

    if (filters.isVegetarian !== '') {
      filtered = filtered.filter(food => food.isVegetarian === (filters.isVegetarian === 'true'));
    }

    if (filters.search) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        food.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredFoods(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAddToCart = (food) => {
    if (!isAuthenticated()) {
      toast.error('Please login to order food');
      return;
    }

    if (!hasRole('customer')) {
      toast.error('Only customers can order food');
      return;
    }

    addToCart(food);
  };

  const handleQuantityChange = (food, change) => {
    if (!isAuthenticated() || !hasRole('customer')) return;

    const cartItem = getCartItem(food._id);
    if (cartItem) {
      const newQuantity = cartItem.quantity + change;
      if (newQuantity > 0) {
        updateQuantity(food._id, newQuantity);
      } else {
        updateQuantity(food._id, 0); // This will remove the item
      }
    } else if (change > 0) {
      addToCart(food);
    }
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'beverages', label: 'Beverages' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-32 h-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" id="main-content">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Our Food Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Delicious meals prepared with fresh ingredients and delivered to your room
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Filter Menu</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search food..."
                className="input pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                aria-label="Search food items"
              />
            </div>

            <select
              className="input"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              aria-label="Filter by category"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              className="input"
              value={filters.isVegetarian}
              onChange={(e) => handleFilterChange('isVegetarian', e.target.value)}
              aria-label="Filter by dietary preference"
            >
              <option value="">All Items</option>
              <option value="true">Vegetarian Only</option>
              <option value="false">Non-Vegetarian</option>
            </select>

            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-600">
                {filteredFoods.length} items found
              </span>
            </div>
          </div>
        </motion.div>

        {/* Food Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFoods.map((food, index) => {
            const cartItem = getCartItem(food._id);
            const quantity = cartItem ? cartItem.quantity : 0;

            return (
              <motion.div
                key={food._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-xl transition-shadow duration-300 overflow-hidden p-0 card-hover"
              >
                {/* Food Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={food.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                    alt={food.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    {food.isVegetarian && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center status-badge">
                        <Leaf className="w-3 h-3 mr-1" />
                        Veg
                      </span>
                    )}
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize status-badge">
                      {food.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-lg font-bold text-gray-800">${food.price}</span>
                  </div>
                </div>

                {/* Food Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{food.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{food.preparationTime} mins</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">4.5</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{food.description}</p>

                  {/* Ingredients */}
                  {food.ingredients && food.ingredients.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {food.ingredients.slice(0, 3).map((ingredient, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {ingredient}
                          </span>
                        ))}
                        {food.ingredients.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{food.ingredients.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cart Controls */}
                  <div className="flex items-center justify-between">
                    {isAuthenticated() && hasRole('customer') ? (
                      quantity > 0 ? (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(food, -1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={`Decrease quantity of ${food.name}`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-8 text-center">{quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(food, 1)}
                            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={`Increase quantity of ${food.name}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(food)}
                          disabled={!food.isAvailable}
                          className={`btn ${food.isAvailable ? 'btn-primary' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                          <Plus className="w-4 h-4" />
                          Add to Cart
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handleAddToCart(food)}
                        className="btn btn-primary"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {isAuthenticated() ? 'Staff/Admin View' : 'Login to Order'}
                      </button>
                    )}
                    
                    <span className="text-lg font-bold text-gray-800">${food.price}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredFoods.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No items found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FoodMenu;