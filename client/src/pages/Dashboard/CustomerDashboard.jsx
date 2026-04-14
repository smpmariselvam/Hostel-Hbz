import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { 
  Calendar, 
  CreditCard, 
  MapPin, 
  Clock, 
  Star,
  ArrowRight,
  Bed,
  Utensils,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { setIsCartOpen } = useCart();
  const [dashboardData, setDashboardData] = useState({
    recentBookings: [],
    recentFoodOrders: [],
    totalSpent: 0,
    totalBookingSpent: 0,
    totalFoodSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/customer/dashboard');
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'checked-in': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'checked-out': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      preparing: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      ready: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      delivered: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-32 h-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900" id="main-content">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your bookings and explore our services
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Spent</p>
                <p className="text-2xl font-bold">${dashboardData.totalSpent}</p>
                <p className="text-blue-100 text-xs mt-1">
                  Rooms: ${dashboardData.totalBookingSpent} | Food: ${dashboardData.totalFoodSpent}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-r from-teal-600 to-teal-700 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold">{dashboardData.recentBookings.length}</p>
                <p className="text-teal-100 text-xs mt-1">Room reservations</p>
              </div>
              <Bed className="w-8 h-8 text-teal-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-gradient-to-r from-green-600 to-green-700 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Food Orders</p>
                <p className="text-2xl font-bold">{dashboardData.recentFoodOrders.length}</p>
                <p className="text-green-100 text-xs mt-1">Delicious meals</p>
              </div>
              <Utensils className="w-8 h-8 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-r from-purple-600 to-purple-700 text-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleCartClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Shopping Cart</p>
                <p className="text-2xl font-bold">View Cart</p>
                <p className="text-purple-100 text-xs mt-1">Add items to cart</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-purple-200" />
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Recent Bookings</h2>
              <Link to="/rooms" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Book New Room
              </Link>
            </div>

            {dashboardData.recentBookings.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentBookings.map((booking) => (
                  <div key={booking._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">{booking.room?.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Room {booking.room?.roomNumber}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(booking.checkOut).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="font-medium text-gray-800 dark:text-gray-200">${booking.totalAmount}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{booking.guests} guests</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bed className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No bookings yet</p>
                <Link to="/rooms" className="btn btn-primary">
                  Browse Rooms
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recent Food Orders */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Recent Food Orders</h2>
              <Link to="/food-menu" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Order Food
              </Link>
            </div>

            {dashboardData.recentFoodOrders.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentFoodOrders.map((order) => (
                  <div key={order._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">
                          Order #{order._id.slice(-6)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.items?.length} items
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{order.deliveryLocation}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="font-medium text-gray-800 dark:text-gray-200">${order.totalAmount}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No food orders yet</p>
                <Link to="/food-menu" className="btn btn-primary">
                  View Menu
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/rooms" className="card hover:shadow-lg transition-shadow text-center group">
              <Bed className="w-8 h-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Book Room</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Find and book your perfect stay</p>
            </Link>
            
            <Link to="/food-menu" className="card hover:shadow-lg transition-shadow text-center group">
              <Utensils className="w-8 h-8 text-teal-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Order Food</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Browse our delicious menu</p>
            </Link>
            
            <button onClick={handleCartClick} className="card hover:shadow-lg transition-shadow text-center group">
              <ShoppingCart className="w-8 h-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Shopping Cart</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View and manage your cart</p>
            </button>
            
            <Link to="/facilities" className="card hover:shadow-lg transition-shadow text-center group">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Facilities</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Explore our amenities</p>
            </Link>
          </div>
        </motion.div>

        {/* Spending Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 card bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Spending Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-indigo-100 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold">${dashboardData.totalSpent}</p>
                </div>
                <div>
                  <p className="text-indigo-100 text-sm">Room Bookings</p>
                  <p className="text-xl font-semibold">${dashboardData.totalBookingSpent}</p>
                </div>
                <div>
                  <p className="text-indigo-100 text-sm">Food Orders</p>
                  <p className="text-xl font-semibold">${dashboardData.totalFoodSpent}</p>
                </div>
              </div>
            </div>
            <TrendingUp className="w-12 h-12 text-indigo-200" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerDashboard;