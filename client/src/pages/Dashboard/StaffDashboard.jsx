import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  Calendar, 
  Utensils, 
  Bed, 
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Phone,
  Mail,
  MapPin,
  User,
  Package,
  MessageSquare,
  Send
} from 'lucide-react';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    assignedBookings: [],
    assignedFoodOrders: [],
    roomsToClean: [],
    pendingComplaints: []
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/staff/dashboard');
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const updateRoomStatus = async (roomId, status) => {
    setUpdating(prev => ({ ...prev, [`room-${roomId}`]: true }));
    
    try {
      await axios.put(`/api/staff/rooms/${roomId}/status`, { status });
      toast.success(`Room status updated to ${status}`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating room status:', error);
      toast.error('Failed to update room status');
    }
    
    setUpdating(prev => ({ ...prev, [`room-${roomId}`]: false }));
  };

  const updateOrderStatus = async (orderId, status) => {
    setUpdating(prev => ({ ...prev, [`order-${orderId}`]: true }));
    
    try {
      await axios.put(`/api/staff/food-orders/${orderId}/status`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
    
    setUpdating(prev => ({ ...prev, [`order-${orderId}`]: false }));
  };

  const updateBookingStatus = async (bookingId, status) => {
    setUpdating(prev => ({ ...prev, [`booking-${bookingId}`]: true }));
    
    try {
      await axios.put(`/api/staff/bookings/${bookingId}/status`, { status });
      toast.success(`Booking status updated to ${status}`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
    
    setUpdating(prev => ({ ...prev, [`booking-${bookingId}`]: false }));
  };

  const respondToComplaint = async (complaintId, response) => {
    setUpdating(prev => ({ ...prev, [`complaint-${complaintId}`]: true }));
    
    try {
      await axios.put(`/api/staff/complaints/${complaintId}/respond`, { response });
      toast.success('Response sent successfully');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error responding to complaint:', error);
      toast.error('Failed to send response');
    }
    
    setUpdating(prev => ({ ...prev, [`complaint-${complaintId}`]: false }));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      'checked-in': 'bg-blue-100 text-blue-800',
      'checked-out': 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      preparing: 'bg-orange-100 text-orange-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
      cleaning: 'bg-yellow-100 text-yellow-800',
      available: 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getNextStatus = (currentStatus, type) => {
    if (type === 'order') {
      const statusFlow = {
        pending: 'preparing',
        preparing: 'ready',
        ready: 'delivered'
      };
      return statusFlow[currentStatus];
    } else if (type === 'booking') {
      const statusFlow = {
        pending: 'confirmed',
        confirmed: 'checked-in',
        'checked-in': 'checked-out'
      };
      return statusFlow[currentStatus];
    }
    return null;
  };

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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Your daily tasks and assignments</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Assigned Bookings</p>
                <p className="text-2xl font-bold">{dashboardData.assignedBookings.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-200" />
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
                <p className="text-teal-100 text-sm">Food Orders</p>
                <p className="text-2xl font-bold">{dashboardData.assignedFoodOrders.length}</p>
              </div>
              <Utensils className="w-8 h-8 text-teal-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-gradient-to-r from-orange-600 to-orange-700 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Rooms to Clean</p>
                <p className="text-2xl font-bold">{dashboardData.roomsToClean.length}</p>
              </div>
              <Bed className="w-8 h-8 text-orange-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-r from-purple-600 to-purple-700 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Pending Complaints</p>
                <p className="text-2xl font-bold">{dashboardData.pendingComplaints?.length || 0}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-200" />
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assigned Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Assigned Bookings
            </h2>
            
            {dashboardData.assignedBookings.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.assignedBookings.map((booking) => (
                  <div key={booking._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {booking.customer?.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                          <Bed className="w-4 h-4" />
                          {booking.room?.name} - Room {booking.room?.roomNumber}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium status-badge ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{booking.customer?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{booking.customer?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {booking.specialRequests && (
                      <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400 dark:border-yellow-600">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                          <div>
                            <span className="font-medium text-yellow-800 dark:text-yellow-200 text-sm">Special Requests:</span>
                            <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">{booking.specialRequests}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {getNextStatus(booking.status, 'booking') && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => updateBookingStatus(booking._id, getNextStatus(booking.status, 'booking'))}
                          disabled={updating[`booking-${booking._id}`]}
                          className="btn btn-sm btn-primary"
                        >
                          {updating[`booking-${booking._id}`] ? (
                            <div className="loading-spinner w-4 h-4" />
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Mark as {getNextStatus(booking.status, 'booking').replace('-', ' ')}
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No assigned bookings</p>
              </div>
            )}
          </motion.div>

          {/* Food Orders */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              Food Orders
            </h2>
            
            {dashboardData.assignedFoodOrders.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.assignedFoodOrders.map((order) => (
                  <div key={order._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Order #{order._id.slice(-6)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                          <User className="w-4 h-4" />
                          {order.customer?.name}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium status-badge ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{order.deliveryLocation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="font-medium">Items:</span>
                      <ul className="mt-1 space-y-1">
                        {order.items?.map((item, index) => (
                          <li key={index} className="flex justify-between">
                            <span>{item.food?.name} x{item.quantity}</span>
                            <span>${item.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {order.specialInstructions && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400 dark:border-blue-600">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <span className="font-medium text-blue-800 dark:text-blue-200 text-sm">Instructions:</span>
                            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">{order.specialInstructions}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-medium text-gray-800 dark:text-gray-200">Total: ${order.totalAmount}</span>
                      
                      {getNextStatus(order.status, 'order') && (
                        <button
                          onClick={() => updateOrderStatus(order._id, getNextStatus(order.status, 'order'))}
                          disabled={updating[`order-${order._id}`]}
                          className="btn btn-sm btn-primary"
                        >
                          {updating[`order-${order._id}`] ? (
                            <div className="loading-spinner w-4 h-4" />
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Mark as {getNextStatus(order.status, 'order')}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Utensils className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No food orders assigned</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Rooms to Clean */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 card"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
            <Bed className="w-5 h-5" />
            Rooms Requiring Cleaning
          </h2>
          
          {dashboardData.roomsToClean.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.roomsToClean.map((room) => (
                <div key={room._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">{room.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Room {room.roomNumber}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">Floor {room.floor}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium status-badge ${getStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateRoomStatus(room._id, 'available')}
                      disabled={updating[`room-${room._id}`]}
                      className="flex-1 btn btn-sm btn-success"
                    >
                      {updating[`room-${room._id}`] ? (
                        <div className="loading-spinner w-4 h-4" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Mark Clean
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bed className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No rooms need cleaning</p>
            </div>
          )}
        </motion.div>

        {/* Pending Complaints */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 card"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Customer Complaints
          </h2>
          
          {dashboardData.pendingComplaints && dashboardData.pendingComplaints.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.pendingComplaints.map((complaint) => (
                <div key={complaint._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">{complaint.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        From: {complaint.customer?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{complaint.description}</p>
                  
                  {complaint.response ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">Response:</p>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">{complaint.response}</p>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Type your response..."
                        className="flex-1 input text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            respondToComplaint(complaint._id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.target.parentElement.querySelector('input');
                          if (input.value.trim()) {
                            respondToComplaint(complaint._id, input.value);
                            input.value = '';
                          }
                        }}
                        disabled={updating[`complaint-${complaint._id}`]}
                        className="btn btn-sm btn-primary"
                      >
                        {updating[`complaint-${complaint._id}`] ? (
                          <div className="loading-spinner w-4 h-4" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No pending complaints</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StaffDashboard;