import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  Users, 
  Bed, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Utensils,
  Settings,
  Bell,
  BarChart3,
  CreditCard,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  RefreshCw,
  X,
  Save,
  ArrowUpDown,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentBookings: [],
    recentFoodOrders: [],
    recentComplaints: []
  });

  // States for different sections
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [foodOrders, setFoodOrders] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState({
    bookingPayments: [],
    foodPayments: [],
    totals: {
      booking: { amount: 0, count: 0 },
      food: { amount: 0, count: 0 },
      overall: { amount: 0, count: 0 }
    }
  });
  const [analytics, setAnalytics] = useState({
    revenue: [],
    roomTypes: [],
    customers: []
  });

  // Filter states
  const [filters, setFilters] = useState({
    users: { role: '', search: '', approval: '' },
    rooms: { type: '', status: '', search: '' },
    bookings: { status: '', search: '' },
    foodItems: { category: '', search: '' },
    foodOrders: { status: '', search: '' },
    complaints: { status: '', category: '', priority: '', search: '' },
    notifications: { type: '', search: '' },
    payments: { type: '', search: '' }
  });

  // Modal states
  const [modals, setModals] = useState({
    userDetails: null,
    roomForm: null,
    foodForm: null,
    complaintDetails: null,
    notificationForm: false
  });

  // Form states
  const [forms, setForms] = useState({
    room: { name: '', type: 'single', description: '', price: '', capacity: '', floor: '', roomNumber: '', amenities: [] },
    food: { name: '', description: '', price: '', category: 'breakfast', preparationTime: '', isVegetarian: true },
    notification: { recipient: '', title: '', message: '', type: 'info', priority: 'medium' }
  });

  // Pagination states
  const [pagination, setPagination] = useState({
    users: { page: 1, limit: 10, total: 0 },
    rooms: { page: 1, limit: 10, total: 0 },
    bookings: { page: 1, limit: 10, total: 0 },
    foodItems: { page: 1, limit: 10, total: 0 },
    foodOrders: { page: 1, limit: 10, total: 0 },
    complaints: { page: 1, limit: 10, total: 0 },
    notifications: { page: 1, limit: 10, total: 0 },
    payments: { page: 1, limit: 10, total: 0 }
  });

  // Get API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab !== 'overview') {
      fetchTabData(activeTab);
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/dashboard`);
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const fetchTabData = async (tab) => {
    try {
      setLoading(true);
      console.log(`Fetching data for ${tab} tab...`);
      
      switch (tab) {
        case 'users':
          await fetchUsers();
          break;
        case 'rooms':
          await fetchRooms();
          break;
        case 'bookings':
          await fetchBookings();
          break;
        case 'food-menu':
          await fetchFoodItems();
          break;
        case 'food-orders':
          await fetchFoodOrders();
          break;
        case 'complaints':
          await fetchComplaints();
          break;
        case 'notifications':
          await fetchNotifications();
          break;
        case 'payments':
          await fetchPayments();
          break;
        case 'analytics':
          await fetchAnalytics();
          break;
        case 'settings':
          // No API call needed for settings
          setLoading(false);
          break;
        default:
          setLoading(false);
      }
    } catch (error) {
      console.error(`Error fetching ${tab} data:`, error);
      toast.error(`Failed to load ${tab} data`);
      setLoading(false);
    }
  };

  // Users tab functions
  const fetchUsers = async () => {
    const { role, search, approval } = filters.users;
    const { page, limit } = pagination.users;
    
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (search) params.append('search', search);
    if (approval) params.append('approval', approval);
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await axios.get(`${API_URL}/api/admin/users?${params}`);
    setUsers(response.data.users || []);
    setPagination(prev => ({
      ...prev,
      users: {
        ...prev.users,
        total: response.data.total || 0
      }
    }));
    setLoading(false);
  };

  const handleUserApproval = async (userId, isApproved) => {
    try {
      await axios.put(`${API_URL}/api/admin/users/${userId}/approval`, { isApproved });
      toast.success(`User ${isApproved ? 'approved' : 'rejected'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user approval');
    }
  };

  const handleUserRoleChange = async (userId, role) => {
    try {
      await axios.put(`${API_URL}/api/admin/users/${userId}/role`, { role });
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/api/admin/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  // Rooms tab functions
  const fetchRooms = async () => {
    const { type, status, search } = filters.rooms;
    const { page, limit } = pagination.rooms;
    
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await axios.get(`${API_URL}/api/admin/rooms?${params}`);
    setRooms(response.data.rooms || []);
    setPagination(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        total: response.data.total || 0
      }
    }));
    setLoading(false);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/admin/rooms`, forms.room);
      toast.success('Room created successfully');
      setModals({ ...modals, roomForm: null });
      setForms({ ...forms, room: { name: '', type: 'single', description: '', price: '', capacity: '', floor: '', roomNumber: '', amenities: [] } });
      fetchRooms();
    } catch (error) {
      toast.error('Failed to create room');
    }
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/admin/rooms/${modals.roomForm}`, forms.room);
      toast.success('Room updated successfully');
      setModals({ ...modals, roomForm: null });
      fetchRooms();
    } catch (error) {
      toast.error('Failed to update room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`${API_URL}/api/admin/rooms/${roomId}`);
        toast.success('Room deleted successfully');
        fetchRooms();
      } catch (error) {
        toast.error('Failed to delete room');
      }
    }
  };

  // Bookings tab functions
  const fetchBookings = async () => {
    const { status, search } = filters.bookings;
    const { page, limit } = pagination.bookings;
    
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await axios.get(`${API_URL}/api/admin/bookings?${params}`);
    setBookings(response.data.bookings || []);
    setPagination(prev => ({
      ...prev,
      bookings: {
        ...prev.bookings,
        total: response.data.total || 0
      }
    }));
    setLoading(false);
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(`${API_URL}/api/admin/bookings/${bookingId}/status`, { status });
      toast.success('Booking status updated successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  // Food menu tab functions
  const fetchFoodItems = async () => {
    const { category, search } = filters.foodItems;
    const { page, limit } = pagination.foodItems;
    
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await axios.get(`${API_URL}/api/admin/food?${params}`);
    setFoodItems(response.data.foods || []);
    setPagination(prev => ({
      ...prev,
      foodItems: {
        ...prev.foodItems,
        total: response.data.total || 0
      }
    }));
    setLoading(false);
  };

  const handleCreateFood = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/admin/food`, forms.food);
      toast.success('Food item created successfully');
      setModals({ ...modals, foodForm: null });
      setForms({ ...forms, food: { name: '', description: '', price: '', category: 'breakfast', preparationTime: '', isVegetarian: true } });
      fetchFoodItems();
    } catch (error) {
      toast.error('Failed to create food item');
    }
  };

  const handleUpdateFood = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/admin/food/${modals.foodForm}`, forms.food);
      toast.success('Food item updated successfully');
      setModals({ ...modals, foodForm: null });
      fetchFoodItems();
    } catch (error) {
      toast.error('Failed to update food item');
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await axios.delete(`${API_URL}/api/admin/food/${foodId}`);
        toast.success('Food item deleted successfully');
        fetchFoodItems();
      } catch (error) {
        toast.error('Failed to delete food item');
      }
    }
  };

  // Food orders tab functions
  const fetchFoodOrders = async () => {
    const { status, search } = filters.foodOrders;
    const { page, limit } = pagination.foodOrders;
    
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await axios.get(`${API_URL}/api/admin/food-orders?${params}`);
    setFoodOrders(response.data.orders || []);
    setPagination(prev => ({
      ...prev,
      foodOrders: {
        ...prev.foodOrders,
        total: response.data.total || 0
      }
    }));
    setLoading(false);
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${API_URL}/api/admin/food-orders/${orderId}/status`, { status });
      toast.success('Order status updated successfully');
      fetchFoodOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  // Complaints tab functions
  const fetchComplaints = async () => {
    const { status, category, priority, search } = filters.complaints;
    const { page, limit } = pagination.complaints;
    
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    if (priority) params.append('priority', priority);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await axios.get(`${API_URL}/api/admin/complaints?${params}`);
    setComplaints(response.data.complaints || []);
    setPagination(prev => ({
      ...prev,
      complaints: {
        ...prev.complaints,
        total: response.data.total || 0
      }
    }));
    setLoading(false);
  };

  const handleComplaintResponse = async (complaintId, response) => {
    try {
      await axios.put(`${API_URL}/api/admin/complaints/${complaintId}/respond`, { response });
      toast.success('Response sent successfully');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to send response');
    }
  };

  const handleUpdateComplaintStatus = async (complaintId, status) => {
    try {
      await axios.put(`${API_URL}/api/admin/complaints/${complaintId}/status`, { status });
      toast.success('Complaint status updated successfully');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to update complaint status');
    }
  };

  // Notifications tab functions
  const fetchNotifications = async () => {
    const { type, search } = filters.notifications;
    const { page, limit } = pagination.notifications;
    
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await axios.get(`${API_URL}/api/admin/notifications?${params}`);
    setNotifications(response.data.notifications || []);
    setPagination(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        total: response.data.total || 0
      }
    }));
    setLoading(false);
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/admin/notifications`, forms.notification);
      toast.success('Notification sent successfully');
      setModals({ ...modals, notificationForm: false });
      setForms({ ...forms, notification: { recipient: '', title: '', message: '', type: 'info', priority: 'medium' } });
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to send notification');
    }
  };

  // Payments tab functions
  const fetchPayments = async () => {
    const { type, search } = filters.payments;
    const { page, limit } = pagination.payments;
    
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);
    
    const response = await axios.get(`${API_URL}/api/admin/payment-history?${params}`);
    setPaymentHistory(response.data);
    setLoading(false);
  };

  // Analytics tab functions
  const fetchAnalytics = async () => {
    const response = await axios.get(`${API_URL}/api/admin/analytics?period=30`);
    setAnalytics(response.data);
    setLoading(false);
  };

  // Filter handling
  const handleFilterChange = (section, key, value) => {
    setFilters(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    
    // Reset to page 1 when filter changes
    setPagination(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        page: 1
      }
    }));
  };

  const clearFilters = (section) => {
    const emptyFilters = {
      users: { role: '', search: '', approval: '' },
      rooms: { type: '', status: '', search: '' },
      bookings: { status: '', search: '' },
      foodItems: { category: '', search: '' },
      foodOrders: { status: '', search: '' },
      complaints: { status: '', category: '', priority: '', search: '' },
      notifications: { type: '', search: '' },
      payments: { type: '', search: '' }
    };
    
    setFilters(prev => ({
      ...prev,
      [section]: emptyFilters[section]
    }));
  };

  // Pagination handling
  const handlePageChange = (section, newPage) => {
    setPagination(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        page: newPage
      }
    }));
  };

  // Utility functions
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'checked-in': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'checked-out': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      preparing: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      ready: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      delivered: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      occupied: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      cleaning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      maintenance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      refunded: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-600 dark:text-green-400',
      medium: 'text-yellow-600 dark:text-yellow-400',
      high: 'text-red-600 dark:text-red-400'
    };
    return colors[priority] || 'text-gray-600 dark:text-gray-400';
  };

  const getRoomTypeLabel = (type) => {
    const labels = {
      single: 'Single Room',
      double: 'Double Room',
      suite: 'Suite',
      shared: 'Shared Room',
      hostel: 'Hostel Bed'
    };
    return labels[type] || type;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'rooms', label: 'Rooms', icon: Bed },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'food-menu', label: 'Food Menu', icon: Utensils },
    { id: 'food-orders', label: 'Food Orders', icon: Utensils },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading && activeTab === 'overview') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 border-blue-600 loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" id="main-content">
      <div className="container max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-200">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}! Manage your hostel operations from here.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-white card bg-gradient-to-r from-blue-600 to-blue-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-100">Total Bookings</p>
                        <p className="text-2xl font-bold">{dashboardData.stats.totalBookings || 0}</p>
                        <p className="text-xs text-blue-100">Active: {dashboardData.stats.activeBookings || 0}</p>
                      </div>
                      <Calendar className="w-8 h-8 text-blue-200" />
                    </div>
                  </div>

                  <div className="text-white card bg-gradient-to-r from-teal-600 to-teal-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-teal-100">Total Users</p>
                        <p className="text-2xl font-bold">{(dashboardData.stats.totalCustomers || 0) + (dashboardData.stats.totalStaff || 0)}</p>
                        <p className="text-xs text-teal-100">Staff: {dashboardData.stats.totalStaff || 0} | Customers: {dashboardData.stats.totalCustomers || 0}</p>
                      </div>
                      <Users className="w-8 h-8 text-teal-200" />
                    </div>
                  </div>

                  <div className="text-white card bg-gradient-to-r from-green-600 to-green-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-100">Total Revenue</p>
                        <p className="text-2xl font-bold">${dashboardData.stats.totalEarnings || 0}</p>
                        <p className="text-xs text-green-100">Rooms: ${dashboardData.stats.totalBookingRevenue || 0} | Food: ${dashboardData.stats.totalFoodRevenue || 0}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-200" />
                    </div>
                  </div>

                  <div className="text-white card bg-gradient-to-r from-purple-600 to-purple-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-100">Occupancy Rate</p>
                        <p className="text-2xl font-bold">{dashboardData.stats.occupancyRate || 0}%</p>
                        <p className="text-xs text-purple-100">Available: {dashboardData.stats.availableRooms || 0}/{dashboardData.stats.totalRooms || 0}</p>
                      </div>
                      <Bed className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="card">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Bookings</h3>
                    <div className="space-y-4">
                      {dashboardData.recentBookings && dashboardData.recentBookings.length > 0 ? (
                        dashboardData.recentBookings.slice(0, 5).map((booking) => (
                          <div key={booking._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-200">{booking.customer?.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{booking.room?.name} - Room {booking.room?.roomNumber}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center text-gray-500">No recent bookings found</div>
                      )}
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Food Orders</h3>
                    <div className="space-y-4">
                      {dashboardData.recentFoodOrders && dashboardData.recentFoodOrders.length > 0 ? (
                        dashboardData.recentFoodOrders.slice(0, 5).map((order) => (
                          <div key={order._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-200">{order.customer?.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Order #{order._id.slice(-6)} - ${order.totalAmount}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center text-gray-500">No recent food orders found</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Users Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">User Management</h2>
                  <button
                    onClick={() => fetchUsers()}
                    className="btn btn-outline"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                {/* Users Filters */}
                <div className="card">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="relative">
                      <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 input"
                        value={filters.users.search}
                        onChange={(e) => handleFilterChange('users', 'search', e.target.value)}
                      />
                    </div>

                    <select
                      className="input"
                      value={filters.users.role}
                      onChange={(e) => handleFilterChange('users', 'role', e.target.value)}
                    >
                      <option value="">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="customer">Customer</option>
                    </select>

                    <select
                      className="input"
                      value={filters.users.approval}
                      onChange={(e) => handleFilterChange('users', 'approval', e.target.value)}
                    >
                      <option value="">All Approval Status</option>
                      <option value="true">Approved</option>
                      <option value="false">Pending Approval</option>
                    </select>

                    <button
                      onClick={() => clearFilters('users')}
                      className="btn btn-outline"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                {/* Users List */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-b-2 border-blue-600 loading-spinner"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Name</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Email</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Role</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Status</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.length > 0 ? (
                          users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-600">
                                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-gray-100">{user.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleUserRoleChange(user._id, e.target.value)}
                                  className="px-2 py-1 text-sm bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                                >
                                  <option value="customer">Customer</option>
                                  <option value="staff">Staff</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {user.role === 'staff' ? (
                                  <div className="flex items-center">
                                    {user.isApproved ? (
                                      <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200">
                                        Approved
                                      </span>
                                    ) : (
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => handleUserApproval(user._id, true)}
                                          className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full dark:bg-yellow-900 dark:text-yellow-200"
                                        >
                                          <UserCheck className="w-3 h-3 mr-1" />
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => handleUserApproval(user._id, false)}
                                          className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full dark:bg-red-900 dark:text-red-200"
                                        >
                                          <UserX className="w-3 h-3 mr-1" />
                                          Reject
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200">
                                    Active
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="ml-3 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {pagination.users.total > pagination.users.limit && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {((pagination.users.page - 1) * pagination.users.limit) + 1} to {Math.min(pagination.users.page * pagination.users.limit, pagination.users.total)} of {pagination.users.total} users
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange('users', pagination.users.page - 1)}
                        disabled={pagination.users.page === 1}
                        className="btn btn-sm btn-outline"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {pagination.users.page} of {Math.ceil(pagination.users.total / pagination.users.limit)}
                      </span>
                      <button
                        onClick={() => handlePageChange('users', pagination.users.page + 1)}
                        disabled={pagination.users.page === Math.ceil(pagination.users.total / pagination.users.limit)}
                        className="btn btn-sm btn-outline"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rooms Tab */}
            {activeTab === 'rooms' && (
              <div className="space-y-6">
                {/* Rooms Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Room Management</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setForms({
                          ...forms,
                          room: { name: '', type: 'single', description: '', price: '', capacity: '', floor: '', roomNumber: '', amenities: [] }
                        });
                        setModals({ ...modals, roomForm: 'new' });
                      }}
                      className="btn btn-primary"
                    >
                      <Plus className="w-4 h-4" />
                      Add Room
                    </button>
                    <button
                      onClick={() => fetchRooms()}
                      className="btn btn-outline"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Rooms Filters */}
                <div className="card">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="relative">
                      <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        placeholder="Search rooms..."
                        className="pl-10 input"
                        value={filters.rooms.search}
                        onChange={(e) => handleFilterChange('rooms', 'search', e.target.value)}
                      />
                    </div>

                    <select
                      className="input"
                      value={filters.rooms.type}
                      onChange={(e) => handleFilterChange('rooms', 'type', e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="single">Single Room</option>
                      <option value="double">Double Room</option>
                      <option value="suite">Suite</option>
                      <option value="shared">Shared Room</option>
                      <option value="hostel">Hostel Bed</option>
                    </select>

                    <select
                      className="input"
                      value={filters.rooms.status}
                      onChange={(e) => handleFilterChange('rooms', 'status', e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="maintenance">Maintenance</option>
                    </select>

                    <button
                      onClick={() => clearFilters('rooms')}
                      className="btn btn-outline"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                {/* Rooms List */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-b-2 border-blue-600 loading-spinner"></div>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {rooms.length > 0 ? (
                      rooms.map((room) => (
                        <div key={room._id} className="transition-shadow card hover:shadow-lg">
                          <div className="relative h-40 mb-4 overflow-hidden rounded-lg">
                            <img
                              src={room.images?.[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
                              alt={room.name}
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute top-2 right-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                                {room.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{room.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Room {room.roomNumber} • {getRoomTypeLabel(room.type)}</p>
                            </div>
                            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">${room.price}</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{room.capacity} guests</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>Floor {room.floor}</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setForms({ ...forms, room: { ...room } });
                                setModals({ ...modals, roomForm: room._id });
                              }}
                              className="flex-1 btn btn-sm btn-outline"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room._id)}
                              className="btn btn-sm btn-danger"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 py-12 text-center card">
                        <Bed className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-xl font-semibold text-gray-600 dark:text-gray-400">
                          No rooms found
                        </h3>
                        <p className="mb-4 text-gray-500 dark:text-gray-500">
                          Add your first room to get started
                        </p>
                        <button
                          onClick={() => {
                            setForms({
                              ...forms,
                              room: { name: '', type: 'single', description: '', price: '', capacity: '', floor: '', roomNumber: '', amenities: [] }
                            });
                            setModals({ ...modals, roomForm: 'new' });
                          }}
                          className="btn btn-primary"
                        >
                          <Plus className="w-4 h-4" />
                          Add Room
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {pagination.rooms.total > pagination.rooms.limit && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {((pagination.rooms.page - 1) * pagination.rooms.limit) + 1} to {Math.min(pagination.rooms.page * pagination.rooms.limit, pagination.rooms.total)} of {pagination.rooms.total} rooms
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange('rooms', pagination.rooms.page - 1)}
                        disabled={pagination.rooms.page === 1}
                        className="btn btn-sm btn-outline"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {pagination.rooms.page} of {Math.ceil(pagination.rooms.total / pagination.rooms.limit)}
                      </span>
                      <button
                        onClick={() => handlePageChange('rooms', pagination.rooms.page + 1)}
                        disabled={pagination.rooms.page === Math.ceil(pagination.rooms.total / pagination.rooms.limit)}
                        className="btn btn-sm btn-outline"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Room Form Modal */}
                <AnimatePresence>
                  {modals.roomForm && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                      onClick={() => setModals({ ...modals, roomForm: null })}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-2xl max-h-screen overflow-y-auto bg-white shadow-xl dark:bg-gray-800 rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                              {modals.roomForm === 'new' ? 'Add New Room' : 'Edit Room'}
                            </h2>
                            <button
                              onClick={() => setModals({ ...modals, roomForm: null })}
                              className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <form onSubmit={modals.roomForm === 'new' ? handleCreateRoom : handleUpdateRoom} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="form-group">
                                <label className="form-label">Room Name *</label>
                                <input
                                  type="text"
                                  value={forms.room.name}
                                  onChange={(e) => setForms({ ...forms, room: { ...forms.room, name: e.target.value } })}
                                  className="input"
                                  placeholder="Enter room name"
                                  required
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Room Type *</label>
                                <select
                                  value={forms.room.type}
                                  onChange={(e) => setForms({ ...forms, room: { ...forms.room, type: e.target.value } })}
                                  className="input"
                                  required
                                >
                                  <option value="single">Single Room</option>
                                  <option value="double">Double Room</option>
                                  <option value="suite">Suite</option>
                                  <option value="shared">Shared Room</option>
                                  <option value="hostel">Hostel Bed</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label className="form-label">Price per Night ($) *</label>
                                <input
                                  type="number"
                                  value={forms.room.price}
                                  onChange={(e) => setForms({ ...forms, room: { ...forms.room, price: e.target.value } })}
                                  className="input"
                                  placeholder="Enter price"
                                  required
                                  min="0"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Capacity (Guests) *</label>
                                <input
                                  type="number"
                                  value={forms.room.capacity}
                                  onChange={(e) => setForms({ ...forms, room: { ...forms.room, capacity: e.target.value } })}
                                  className="input"
                                  placeholder="Enter capacity"
                                  required
                                  min="1"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Floor *</label>
                                <input
                                  type="number"
                                  value={forms.room.floor}
                                  onChange={(e) => setForms({ ...forms, room: { ...forms.room, floor: e.target.value } })}
                                  className="input"
                                  placeholder="Enter floor number"
                                  required
                                  min="0"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Room Number *</label>
                                <input
                                  type="text"
                                  value={forms.room.roomNumber}
                                  onChange={(e) => setForms({ ...forms, room: { ...forms.room, roomNumber: e.target.value } })}
                                  className="input"
                                  placeholder="Enter room number"
                                  required
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Description *</label>
                              <textarea
                                value={forms.room.description}
                                onChange={(e) => setForms({ ...forms, room: { ...forms.room, description: e.target.value } })}
                                className="input"
                                rows="3"
                                placeholder="Enter room description"
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Amenities</label>
                              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {['wifi', 'ac', 'tv', 'minibar', 'balcony', 'work_desk', 'jacuzzi', 'breakfast', 'parking'].map((amenity) => (
                                  <label key={amenity} className="flex items-center space-x-2 text-sm">
                                    <input
                                      type="checkbox"
                                      checked={forms.room.amenities?.includes(amenity) || false}
                                      onChange={(e) => {
                                        const updatedAmenities = e.target.checked
                                          ? [...(forms.room.amenities || []), amenity]
                                          : (forms.room.amenities || []).filter(a => a !== amenity);
                                        setForms({ ...forms, room: { ...forms.room, amenities: updatedAmenities } });
                                      }}
                                      className="text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="capitalize">{amenity.replace('_', ' ')}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Status</label>
                              <select
                                value={forms.room.status}
                                onChange={(e) => setForms({ ...forms, room: { ...forms.room, status: e.target.value } })}
                                className="input"
                              >
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="cleaning">Cleaning</option>
                                <option value="maintenance">Maintenance</option>
                              </select>
                            </div>

                            <div className="flex justify-end space-x-3">
                              <button
                                type="button"
                                onClick={() => setModals({ ...modals, roomForm: null })}
                                className="btn btn-outline"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary"
                              >
                                <Save className="w-4 h-4" />
                                {modals.roomForm === 'new' ? 'Create Room' : 'Update Room'}
                              </button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {/* Bookings Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Booking Management</h2>
                  <button
                    onClick={() => fetchBookings()}
                    className="btn btn-outline"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                {/* Bookings Filters */}
                <div className="card">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="relative">
                      <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        className="pl-10 input"
                        value={filters.bookings.search}
                        onChange={(e) => handleFilterChange('bookings', 'search', e.target.value)}
                      />
                    </div>

                    <select
                      className="input"
                      value={filters.bookings.status}
                      onChange={(e) => handleFilterChange('bookings', 'status', e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="checked-in">Checked In</option>
                      <option value="checked-out">Checked Out</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => clearFilters('bookings')}
                      className="btn btn-outline"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                {/* Bookings List */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-b-2 border-blue-600 loading-spinner"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Customer</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Room</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Dates</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Amount</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Status</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {bookings.length > 0 ? (
                          bookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{booking.customer?.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{booking.customer?.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-gray-100">{booking.room?.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Room {booking.room?.roomNumber}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                  {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{booking.guests} guests</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">${booking.totalAmount}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {booking.paymentStatus === 'paid' ? (
                                    <span className="text-green-600 dark:text-green-400">Paid</span>
                                  ) : (
                                    <span className="text-yellow-600 dark:text-yellow-400">Pending</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={booking.status}
                                  onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)}
                                  className={`text-sm rounded px-2 py-1 ${getStatusColor(booking.status)}`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="checked-in">Checked In</option>
                                  <option value="checked-out">Checked Out</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                <button
                                  onClick={() => {/* View booking details */}}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                              No bookings found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {pagination.bookings.total > pagination.bookings.limit && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {((pagination.bookings.page - 1) * pagination.bookings.limit) + 1} to {Math.min(pagination.bookings.page * pagination.bookings.limit, pagination.bookings.total)} of {pagination.bookings.total} bookings
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange('bookings', pagination.bookings.page - 1)}
                        disabled={pagination.bookings.page === 1}
                        className="btn btn-sm btn-outline"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {pagination.bookings.page} of {Math.ceil(pagination.bookings.total / pagination.bookings.limit)}
                      </span>
                      <button
                        onClick={() => handlePageChange('bookings', pagination.bookings.page + 1)}
                        disabled={pagination.bookings.page === Math.ceil(pagination.bookings.total / pagination.bookings.limit)}
                        className="btn btn-sm btn-outline"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Food Menu Tab */}
            {activeTab === 'food-menu' && (
              <div className="space-y-6">
                {/* Food Menu Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Food Menu Management</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setForms({
                          ...forms,
                          food: { name: '', description: '', price: '', category: 'breakfast', preparationTime: '', isVegetarian: true }
                        });
                        setModals({ ...modals, foodForm: 'new' });
                      }}
                      className="btn btn-primary"
                    >
                      <Plus className="w-4 h-4" />
                      Add Food Item
                    </button>
                    <button
                      onClick={() => fetchFoodItems()}
                      className="btn btn-outline"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Food Menu Filters */}
                <div className="card">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="relative">
                      <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        placeholder="Search food items..."
                        className="pl-10 input"
                        value={filters.foodItems.search}
                        onChange={(e) => handleFilterChange('foodItems', 'search', e.target.value)}
                      />
                    </div>

                    <select
                      className="input"
                      value={filters.foodItems.category}
                      onChange={(e) => handleFilterChange('foodItems', 'category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snacks">Snacks</option>
                      <option value="beverages">Beverages</option>
                    </select>

                    <button
                      onClick={() => clearFilters('foodItems')}
                      className="btn btn-outline"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                {/* Food Menu List */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-b-2 border-blue-600 loading-spinner"></div>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {foodItems.length > 0 ? (
                      foodItems.map((food) => (
                        <div key={food._id} className="transition-shadow card hover:shadow-lg">
                          <div className="relative h-40 mb-4 overflow-hidden rounded-lg">
                            <img
                              src={food.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                              alt={food.name}
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute top-2 right-2">
                              {food.isVegetarian && (
                                <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                  Vegetarian
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{food.name}</h3>
                              <p className="text-sm text-gray-600 capitalize dark:text-gray-400">{food.category}</p>
                            </div>
                            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">${food.price}</div>
                          </div>
                          
                          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{food.description}</p>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setForms({ ...forms, food: { ...food } });
                                setModals({ ...modals, foodForm: food._id });
                              }}
                              className="flex-1 btn btn-sm btn-outline"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFood(food._id)}
                              className="btn btn-sm btn-danger"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 py-12 text-center card">
                        <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-xl font-semibold text-gray-600 dark:text-gray-400">
                          No food items found
                        </h3>
                        <p className="mb-4 text-gray-500 dark:text-gray-500">
                          Add your first food item to get started
                        </p>
                        <button
                          onClick={() => {
                            setForms({
                              ...forms,
                              food: { name: '', description: '', price: '', category: 'breakfast', preparationTime: '', isVegetarian: true }
                            });
                            setModals({ ...modals, foodForm: 'new' });
                          }}
                          className="btn btn-primary"
                        >
                          <Plus className="w-4 h-4" />
                          Add Food Item
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {pagination.foodItems.total > pagination.foodItems.limit && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {((pagination.foodItems.page - 1) * pagination.foodItems.limit) + 1} to {Math.min(pagination.foodItems.page * pagination.foodItems.limit, pagination.foodItems.total)} of {pagination.foodItems.total} food items
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange('foodItems', pagination.foodItems.page - 1)}
                        disabled={pagination.foodItems.page === 1}
                        className="btn btn-sm btn-outline"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {pagination.foodItems.page} of {Math.ceil(pagination.foodItems.total / pagination.foodItems.limit)}
                      </span>
                      <button
                        onClick={() => handlePageChange('foodItems', pagination.foodItems.page + 1)}
                        disabled={pagination.foodItems.page === Math.ceil(pagination.foodItems.total / pagination.foodItems.limit)}
                        className="btn btn-sm btn-outline"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Food Form Modal */}
                <AnimatePresence>
                  {modals.foodForm && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                      onClick={() => setModals({ ...modals, foodForm: null })}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-2xl max-h-screen overflow-y-auto bg-white shadow-xl dark:bg-gray-800 rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                              {modals.foodForm === 'new' ? 'Add New Food Item' : 'Edit Food Item'}
                            </h2>
                            <button
                              onClick={() => setModals({ ...modals, foodForm: null })}
                              className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <form onSubmit={modals.foodForm === 'new' ? handleCreateFood : handleUpdateFood} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="form-group">
                                <label className="form-label">Food Name *</label>
                                <input
                                  type="text"
                                  value={forms.food.name}
                                  onChange={(e) => setForms({ ...forms, food: { ...forms.food, name: e.target.value } })}
                                  className="input"
                                  placeholder="Enter food name"
                                  required
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Category *</label>
                                <select
                                  value={forms.food.category}
                                  onChange={(e) => setForms({ ...forms, food: { ...forms.food, category: e.target.value } })}
                                  className="input"
                                  required
                                >
                                  <option value="breakfast">Breakfast</option>
                                  <option value="lunch">Lunch</option>
                                  <option value="dinner">Dinner</option>
                                  <option value="snacks">Snacks</option>
                                  <option value="beverages">Beverages</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label className="form-label">Price ($) *</label>
                                <input
                                  type="number"
                                  value={forms.food.price}
                                  onChange={(e) => setForms({ ...forms, food: { ...forms.food, price: e.target.value } })}
                                  className="input"
                                  placeholder="Enter price"
                                  required
                                  min="0"
                                  step="0.01"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Preparation Time (mins) *</label>
                                <input
                                  type="number"
                                  value={forms.food.preparationTime}
                                  onChange={(e) => setForms({ ...forms, food: { ...forms.food, preparationTime: e.target.value } })}
                                  className="input"
                                  placeholder="Enter preparation time"
                                  required
                                  min="1"
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Description *</label>
                              <textarea
                                value={forms.food.description}
                                onChange={(e) => setForms({ ...forms, food: { ...forms.food, description: e.target.value } })}
                                className="input"
                                rows="3"
                                placeholder="Enter food description"
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Image URL</label>
                              <input
                                type="text"
                                value={forms.food.image}
                                onChange={(e) => setForms({ ...forms, food: { ...forms.food, image: e.target.value } })}
                                className="input"
                                placeholder="Enter image URL"
                              />
                              <p className="form-help">Leave empty to use default image</p>
                            </div>

                            <div className="form-group">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="isVegetarian"
                                  checked={forms.food.isVegetarian}
                                  onChange={(e) => setForms({ ...forms, food: { ...forms.food, isVegetarian: e.target.checked } })}
                                  className="text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="isVegetarian" className="mb-0 form-label">Vegetarian</label>
                              </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                              <button
                                type="button"
                                onClick={() => setModals({ ...modals, foodForm: null })}
                                className="btn btn-outline"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary"
                              >
                                <Save className="w-4 h-4" />
                                {modals.foodForm === 'new' ? 'Create Food Item' : 'Update Food Item'}
                              </button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Food Orders Tab */}
            {activeTab === 'food-orders' && (
              <div className="space-y-6">
                {/* Food Orders Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Food Order Management</h2>
                  <button
                    onClick={() => fetchFoodOrders()}
                    className="btn btn-outline"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                {/* Food Orders Filters */}
                <div className="card">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="relative">
                      <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-10 input"
                        value={filters.foodOrders.search}
                        onChange={(e) => handleFilterChange('foodOrders', 'search', e.target.value)}
                      />
                    </div>

                    <select
                      className="input"
                      value={filters.foodOrders.status}
                      onChange={(e) => handleFilterChange('foodOrders', 'status', e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => clearFilters('foodOrders')}
                      className="btn btn-outline"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                {/* Food Orders List */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-b-2 border-blue-600 loading-spinner"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {foodOrders.length > 0 ? (
                      foodOrders.map((order) => (
                        <div key={order._id} className="transition-shadow card hover:shadow-lg">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                    Order #{order._id.slice(-6)}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(order.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </div>
                              
                              <div className="mb-3">
                                <h4 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Customer</h4>
                                <div className="flex items-center space-x-3 text-sm">
                                  <div className="flex items-center space-x-1">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span>{order.customer?.name}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span>{order.customer?.email}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mb-3">
                                <h4 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Location</h4>
                                <div className="flex items-center space-x-1 text-sm">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span>{order.deliveryLocation}</span>
                                </div>
                              </div>
                              
                              {order.specialInstructions && (
                                <div className="p-3 mb-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                                  <h4 className="mb-1 text-sm font-medium text-yellow-800 dark:text-yellow-200">Special Instructions</h4>
                                  <p className="text-sm text-yellow-700 dark:text-yellow-300">{order.specialInstructions}</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-3 md:w-1/3">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Order Items</h4>
                              <div className="space-y-2 overflow-y-auto max-h-40">
                                {order.items?.map((item, index) => (
                                  <div key={index} className="flex justify-between p-2 text-sm rounded bg-gray-50 dark:bg-gray-700">
                                    <span>{item.food?.name} x{item.quantity}</span>
                                    <span className="font-medium">${item.price}</span>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                                <span className="font-medium">Total:</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">${order.totalAmount}</span>
                              </div>
                              
                              <div className="pt-3">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                  className="w-full input"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="preparing">Preparing</option>
                                  <option value="ready">Ready</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center card">
                        <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-xl font-semibold text-gray-600 dark:text-gray-400">
                          No food orders found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500">
                          No orders match your current filters
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {pagination.foodOrders.total > pagination.foodOrders.limit && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {((pagination.foodOrders.page - 1) * pagination.foodOrders.limit) + 1} to {Math.min(pagination.foodOrders.page * pagination.foodOrders.limit, pagination.foodOrders.total)} of {pagination.foodOrders.total} orders
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange('foodOrders', pagination.foodOrders.page - 1)}
                        disabled={pagination.foodOrders.page === 1}
                        className="btn btn-sm btn-outline"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {pagination.foodOrders.page} of {Math.ceil(pagination.foodOrders.total / pagination.foodOrders.limit)}
                      </span>
                      <button
                        onClick={() => handlePageChange('foodOrders', pagination.foodOrders.page + 1)}
                        disabled={pagination.foodOrders.page === Math.ceil(pagination.foodOrders.total / pagination.foodOrders.limit)}
                        className="btn btn-sm btn-outline"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Complaints Tab */}
            {activeTab === 'complaints' && (
              <div className="space-y-6">
                {/* Complaints Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Complaints Management</h2>
                  <button
                    onClick={() => fetchComplaints()}
                    className="btn btn-outline"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                {/* Complaints Filters */}
                <div className="card">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="relative">
                      <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        placeholder="Search complaints..."
                        className="pl-10 input"
                        value={filters.complaints.search}
                        onChange={(e) => handleFilterChange('complaints', 'search', e.target.value)}
                      />
                    </div>

                    <select
                      className="input"
                      value={filters.complaints.status}
                      onChange={(e) => handleFilterChange('complaints', 'status', e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>

                    <select
                      className="input"
                      value={filters.complaints.category}
                      onChange={(e) => handleFilterChange('complaints', 'category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      <option value="general">General</option>
                      <option value="room">Room Issues</option>
                      <option value="service">Service</option>
                      <option value="food">Food & Dining</option>
                      <option value="billing">Billing</option>
                      <option value="facilities">Facilities</option>
                      <option value="staff">Staff Behavior</option>
                      <option value="other">Other</option>
                    </select>

                    <select
                      className="input"
                      value={filters.complaints.priority}
                      onChange={(e) => handleFilterChange('complaints', 'priority', e.target.value)}
                    >
                      <option value="">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Complaints List */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-b-2 border-blue-600 loading-spinner"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {complaints.length > 0 ? (
                      complaints.map((complaint) => (
                        <div key={complaint._id} className="transition-shadow card hover:shadow-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start flex-1 space-x-4">
                              {/* Priority Indicator */}
                              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                complaint.priority === 'high' 
                                  ? 'bg-red-100 dark:bg-red-900' 
                                  : complaint.priority === 'medium'
                                  ? 'bg-yellow-100 dark:bg-yellow-900'
                                  : 'bg-green-100 dark:bg-green-900'
                              }`}>
                                <AlertCircle className={`w-5 h-5 ${getPriorityColor(complaint.priority)}`} />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                {/* Header */}
                                <div className="flex items-center mb-2 space-x-3">
                                  <h3 className="text-lg font-semibold text-gray-800 truncate dark:text-gray-200">
                                    {complaint.title}
                                  </h3>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(complaint.priority)} bg-opacity-10`}>
                                    {complaint.priority}
                                  </span>
                                </div>
                                
                                {/* Customer Info */}
                                <div className="flex items-center mb-3 space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <User className="w-4 h-4" />
                                    <span>{complaint.customer?.name}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Mail className="w-4 h-4" />
                                    <span>{complaint.customer?.email}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                
                                {/* Description */}
                                <p className="mb-4 text-gray-700 dark:text-gray-300 line-clamp-2">
                                  {complaint.description}
                                </p>

                                {/* Response Preview */}
                                {complaint.response && (
                                  <div className="p-3 mb-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                    <p className="text-sm text-blue-700 dark:text-blue-300 line-clamp-2">
                                      <strong>Response:</strong> {complaint.response}
                                    </p>
                                  </div>
                                )}

                                {/* Quick Actions */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                                    <select
                                      value={complaint.status}
                                      onChange={(e) => handleUpdateComplaintStatus(complaint._id, e.target.value)}
                                      className="px-2 py-1 text-sm bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="in-progress">In Progress</option>
                                      <option value="resolved">Resolved</option>
                                      <option value="closed">Closed</option>
                                    </select>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => setModals({ ...modals, complaintDetails: complaint })}
                                      className="btn btn-sm btn-outline"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Status Badge */}
                            <div className="flex-shrink-0 ml-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                                {complaint.status.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center card">
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-xl font-semibold text-gray-600 dark:text-gray-400">
                          No complaints found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500">
                          No complaints match your current filters.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {pagination.complaints.total > pagination.complaints.limit && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {((pagination.complaints.page - 1) * pagination.complaints.limit) + 1} to {Math.min(pagination.complaints.page * pagination.complaints.limit, pagination.complaints.total)} of {pagination.complaints.total} complaints
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange('complaints', pagination.complaints.page - 1)}
                        disabled={pagination.complaints.page === 1}
                        className="btn btn-sm btn-outline"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {pagination.complaints.page} of {Math.ceil(pagination.complaints.total / pagination.complaints.limit)}
                      </span>
                      <button
                        onClick={() => handlePageChange('complaints', pagination.complaints.page + 1)}
                        disabled={pagination.complaints.page === Math.ceil(pagination.complaints.total / pagination.complaints.limit)}
                        className="btn btn-sm btn-outline"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Complaint Details Modal */}
                <AnimatePresence>
                  {modals.complaintDetails && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                      onClick={() => setModals({ ...modals, complaintDetails: null })}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-4xl max-h-screen overflow-y-auto bg-white shadow-xl dark:bg-gray-800 rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-6">
                          {/* Modal Header */}
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                              Complaint Details
                            </h2>
                            <button
                              onClick={() => setModals({ ...modals, complaintDetails: null })}
                              className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="grid gap-8 lg:grid-cols-2">
                            {/* Left Column - Complaint Details */}
                            <div className="space-y-6">
                              {/* Complaint Info */}
                              <div>
                                <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                                  {modals.complaintDetails.title}
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
                                    <p className="font-medium capitalize">{modals.complaintDetails.category}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
                                    <p className={`font-medium capitalize ${getPriorityColor(modals.complaintDetails.priority)}`}>
                                      {modals.complaintDetails.priority}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(modals.complaintDetails.status)}`}>
                                      {modals.complaintDetails.status.replace('-', ' ')}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Created:</span>
                                    <p className="font-medium">{new Date(modals.complaintDetails.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Description:</span>
                                  <p className="p-4 mt-2 text-gray-700 rounded-lg dark:text-gray-300 bg-gray-50 dark:bg-gray-700">
                                    {modals.complaintDetails.description}
                                  </p>
                                </div>
                              </div>

                              {/* Customer Information */}
                              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">Customer Information</h4>
                                <div className="space-y-3">
                                  <div className="flex items-center space-x-3">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <span className="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                                      <p className="font-medium">{modals.complaintDetails.customer?.name}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                                      <p className="font-medium">{modals.complaintDetails.customer?.email}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                                      <p className="font-medium">{modals.complaintDetails.customer?.phone}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Column - Response Section */}
                            <div className="space-y-6">
                              {/* Existing Response */}
                              {modals.complaintDetails.response ? (
                                <div>
                                  <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">Current Response</h4>
                                  <div className="p-4 border-l-4 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                    <p className="mb-2 text-blue-700 dark:text-blue-300">{modals.complaintDetails.response}</p>
                                    {modals.complaintDetails.respondedAt && (
                                      <p className="text-sm text-blue-600 dark:text-blue-400">
                                        Responded on {new Date(modals.complaintDetails.respondedAt).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                  
                                  {/* Update Response */}
                                  <div className="mt-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Update Response:
                                    </label>
                                    <textarea
                                      id="updateResponse"
                                      placeholder="Enter updated response..."
                                      rows="4"
                                      className="input"
                                    />
                                    <button
                                      onClick={() => {
                                        const response = document.getElementById('updateResponse').value;
                                        if (response.trim()) {
                                          handleComplaintResponse(modals.complaintDetails._id, response);
                                          setModals({ ...modals, complaintDetails: null });
                                        } else {
                                          toast.error('Please enter a response');
                                        }
                                      }}
                                      className="w-full mt-3 btn btn-primary"
                                    >
                                      <Send className="w-4 h-4" />
                                      Update Response
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">Send Response</h4>
                                  <textarea
                                    id="newResponse"
                                    placeholder="Type your response to the customer..."
                                    rows="6"
                                    className="input"
                                  />
                                  <button
                                    onClick={() => {
                                      const response = document.getElementById('newResponse').value;
                                      if (response.trim()) {
                                        handleComplaintResponse(modals.complaintDetails._id, response);
                                        setModals({ ...modals, complaintDetails: null });
                                      } else {
                                        toast.error('Please enter a response');
                                      }
                                    }}
                                    className="w-full mt-3 btn btn-primary"
                                  >
                                    <Send className="w-4 h-4" />
                                    Send Response
                                  </button>
                                </div>
                              )}

                              {/* Status Management */}
                              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">Status Management</h4>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Current Status:
                                    </label>
                                    <select
                                      value={modals.complaintDetails.status}
                                      onChange={(e) => {
                                        handleUpdateComplaintStatus(modals.complaintDetails._id, e.target.value);
                                        setModals({
                                          ...modals,
                                          complaintDetails: {
                                            ...modals.complaintDetails,
                                            status: e.target.value
                                          }
                                        });
                                      }}
                                      className="input"
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="in-progress">In Progress</option>
                                      <option value="resolved">Resolved</option>
                                      <option value="closed">Closed</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Complaint Metadata */}
                              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">Complaint Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Complaint ID:</span>
                                    <span className="font-mono text-xs">{modals.complaintDetails._id}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                                    <span>{new Date(modals.complaintDetails.createdAt).toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                                    <span>{new Date(modals.complaintDetails.updatedAt).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                {/* Notifications Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Notification Management</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setModals({ ...modals, notificationForm: true })}
                      className="btn btn-primary"
                    >
                      <Plus className="w-4 h-4" />
                      Send Notification
                    </button>
                    <button
                      onClick={() => fetchNotifications()}
                      className="btn btn-outline"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Notifications Filters */}
                <div className="card">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="relative">
                      <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        placeholder="Search notifications..."
                        className="pl-10 input"
                        value={filters.notifications.search}
                        onChange={(e) => handleFilterChange('notifications', 'search', e.target.value)}
                      />
                    </div>

                    <select
                      className="input"
                      value={filters.notifications.type}
                      onChange={(e) => handleFilterChange('notifications', 'type', e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="info">Info</option>
                      <option value="alert">Alert</option>
                      <option value="booking">Booking</option>
                      <option value="order">Order</option>
                      <option value="system">System</option>
                    </select>

                    <button
                      onClick={() => clearFilters('notifications')}
                      className="btn btn-outline"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-b-2 border-blue-600 loading-spinner"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification._id} className="transition-shadow card hover:shadow-lg">
                          <div className="flex items-start space-x-4">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              notification.priority === 'high' 
                                ? 'bg-red-100 dark:bg-red-900' 
                                : notification.priority === 'medium'
                                ? 'bg-yellow-100 dark:bg-yellow-900'
                                : 'bg-blue-100 dark:bg-blue-900'
                            }`}>
                              <Bell className={`w-5 h-5 ${
                                notification.priority === 'high' 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : notification.priority === 'medium'
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-blue-600 dark:text-blue-400'
                              }`} />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                    {notification.title}
                                  </h3>
                                  <div className="flex items-center mb-2 space-x-3 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="px-2 py-1 text-xs capitalize bg-gray-100 rounded-full dark:bg-gray-700">
                                      {notification.type}
                                    </span>
                                    <span className={`capitalize ${
                                      notification.priority === 'high' 
                                        ? 'text-red-600 dark:text-red-400' 
                                        : notification.priority === 'medium'
                                        ? 'text-yellow-600 dark:text-yellow-400'
                                        : 'text-blue-600 dark:text-blue-400'
                                    }`}>
                                      {notification.priority} priority
                                    </span>
                                    <span>{new Date(notification.createdAt).toLocaleString()}</span>
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300">
                                    {notification.message}
                                  </p>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    To: {notification.recipient?.name || 'Unknown'}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    notification.read 
                                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' 
                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  }`}>
                                    {notification.read ? 'Read' : 'Unread'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center card">
                        <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <h3 className="mb-2 text-xl font-semibold text-gray-600 dark:text-gray-400">
                          No notifications found
                        </h3>
                        <p className="mb-4 text-gray-500 dark:text-gray-500">
                          Send your first notification to get started
                        </p>
                        <button
                          onClick={() => setModals({ ...modals, notificationForm: true })}
                          className="btn btn-primary"
                        >
                          <Plus className="w-4 h-4" />
                          Send Notification
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {pagination.notifications.total > pagination.notifications.limit && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {((pagination.notifications.page - 1) * pagination.notifications.limit) + 1} to {Math.min(pagination.notifications.page * pagination.notifications.limit, pagination.notifications.total)} of {pagination.notifications.total} notifications
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange('notifications', pagination.notifications.page - 1)}
                        disabled={pagination.notifications.page === 1}
                        className="btn btn-sm btn-outline"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {pagination.notifications.page} of {Math.ceil(pagination.notifications.total / pagination.notifications.limit)}
                      </span>
                      <button
                        onClick={() => handlePageChange('notifications', pagination.notifications.page + 1)}
                        disabled={pagination.notifications.page === Math.ceil(pagination.notifications.total / pagination.notifications.limit)}
                        className="btn btn-sm btn-outline"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Notification Form Modal */}
                <AnimatePresence>
                  {modals.notificationForm && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                      onClick={() => setModals({ ...modals, notificationForm: false })}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-2xl max-h-screen overflow-y-auto bg-white shadow-xl dark:bg-gray-800 rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                              Send Notification
                            </h2>
                            <button
                              onClick={() => setModals({ ...modals, notificationForm: false })}
                              className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <form onSubmit={handleCreateNotification} className="space-y-6">
                            <div className="form-group">
                              <label className="form-label">Recipient *</label>
                              <select
                                value={forms.notification.recipient}
                                onChange={(e) => setForms({ ...forms, notification: { ...forms.notification, recipient: e.target.value } })}
                                className="input"
                                required
                              >
                                <option value="">Select Recipient</option>
                                {users.map((user) => (
                                  <option key={user._id} value={user._id}>
                                    {user.name} ({user.email}) - {user.role}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Title *</label>
                              <input
                                type="text"
                                value={forms.notification.title}
                                onChange={(e) => setForms({ ...forms, notification: { ...forms.notification, title: e.target.value } })}
                                className="input"
                                placeholder="Enter notification title"
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Message *</label>
                              <textarea
                                value={forms.notification.message}
                                onChange={(e) => setForms({ ...forms, notification: { ...forms.notification, message: e.target.value } })}
                                className="input"
                                rows="4"
                                placeholder="Enter notification message"
                                required
                              />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="form-group">
                                <label className="form-label">Type</label>
                                <select
                                  value={forms.notification.type}
                                  onChange={(e) => setForms({ ...forms, notification: { ...forms.notification, type: e.target.value } })}
                                  className="input"
                                >
                                  <option value="info">Info</option>
                                  <option value="alert">Alert</option>
                                  <option value="booking">Booking</option>
                                  <option value="order">Order</option>
                                  <option value="system">System</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label className="form-label">Priority</label>
                                <select
                                  value={forms.notification.priority}
                                  onChange={(e) => setForms({ ...forms, notification: { ...forms.notification, priority: e.target.value } })}
                                  className="input"
                                >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                              <button
                                type="button"
                                onClick={() => setModals({ ...modals, notificationForm: false })}
                                className="btn btn-outline"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary"
                              >
                                <Send className="w-4 h-4" />
                                Send Notification
                              </button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                {/* Payments Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Payment History</h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => fetchPayments()}
                      className="btn btn-outline"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                    <button
                      onClick={() => {
                        // Export payments as CSV
                        const bookingPayments = paymentHistory.bookingPayments.map(p => ({
                          type: 'Booking',
                          id: p._id,
                          customer: p.customer?.name,
                          email: p.customer?.email,
                          amount: p.totalAmount,
                          status: p.paymentStatus,
                          date: new Date(p.updatedAt).toLocaleDateString()
                        }));
                        
                        const foodPayments = paymentHistory.foodPayments.map(p => ({
                          type: 'Food Order',
                          id: p._id,
                          customer: p.customer?.name,
                          email: p.customer?.email,
                          amount: p.totalAmount,
                          status: p.status,
                          date: new Date(p.updatedAt).toLocaleDateString()
                        }));
                        
                        const allPayments = [...bookingPayments, ...foodPayments];
                        const csvContent = [
                          ['Type', 'ID', 'Customer', 'Email', 'Amount', 'Status', 'Date'],
                          ...allPayments.map(p => [p.type, p.id, p.customer, p.email, p.amount, p.status, p.date])
                        ].map(row => row.join(',')).join('\n');
                        
                        const blob = new Blob([csvContent], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="btn btn-primary"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="text-white card bg-gradient-to-r from-blue-600 to-blue-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-100">Total Revenue</p>
                        <p className="text-2xl font-bold">${paymentHistory.totals.overall.amount}</p>
                        <p className="text-xs text-blue-100">{paymentHistory.totals.overall.count} transactions</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-blue-200" />
                    </div>
                  </div>

                  <div className="text-white card bg-gradient-to-r from-green-600 to-green-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-100">Booking Revenue</p>
                        <p className="text-2xl font-bold">${paymentHistory.totals.booking.amount}</p>
                        <p className="text-xs text-green-100">{paymentHistory.totals.booking.count} bookings</p>
                      </div>
                      <Bed className="w-8 h-8 text-green-200" />
                    </div>
                  </div>

                  <div className="text-white card bg-gradient-to-r from-purple-600 to-purple-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-100">Food Revenue</p>
                        <p className="text-2xl font-bold">${paymentHistory.totals.food.amount}</p>
                        <p className="text-xs text-purple-100">{paymentHistory.totals.food.count} orders</p>
                      </div>
                      <Utensils className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Payments Filters */}
                <div className="card">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="relative">
                      <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="text"
                        placeholder="Search payments..."
                        className="pl-10 input"
                        value={filters.payments.search}
                        onChange={(e) => handleFilterChange('payments', 'search', e.target.value)}
                      />
                    </div>

                    <select
                      className="input"
                      value={filters.payments.type}
                      onChange={(e) => handleFilterChange('payments', 'type', e.target.value)}
                    >
                      <option value="">All Payment Types</option>
                      <option value="booking">Booking Payments</option>
                      <option value="food">Food Order Payments</option>
                    </select>

                    <button
                      onClick={() => clearFilters('payments')}
                      className="btn btn-outline"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                {/* Payments List */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-b-2 border-blue-600 loading-spinner"></div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Booking Payments */}
                    {(!filters.payments.type || filters.payments.type === 'booking') && (
                      <div className="card">
                        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                          <Bed className="w-5 h-5" />
                          Booking Payments
                        </h3>
                        
                        {paymentHistory.bookingPayments.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Customer</th>
                                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Room</th>
                                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Amount</th>
                                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Status</th>
                                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Date</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {paymentHistory.bookingPayments.map((payment) => (
                                  <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{payment.customer?.name}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">{payment.customer?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900 dark:text-gray-100">{payment.room?.name}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">Room {payment.room?.roomNumber}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">${payment.totalAmount}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.paymentStatus)}`}>
                                        {payment.paymentStatus}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                      {new Date(payment.updatedAt).toLocaleDateString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                            <p className="text-gray-500 dark:text-gray-400">No booking payments found</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Food Order Payments */}
                    {(!filters.payments.type || filters.payments.type === 'food') && (
                      <div className="card">
                        <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                          <Utensils className="w-5 h-5" />
                          Food Order Payments
                        </h3>
                        
                        {paymentHistory.foodPayments.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Customer</th>
                                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Order ID</th>
                                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Items</th>
                                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Amount</th>
                                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Status</th>
                                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Date</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {paymentHistory.foodPayments.map((payment) => (
                                  <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{payment.customer?.name}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">{payment.customer?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900 dark:text-gray-100">#{payment._id.slice(-6)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900 dark:text-gray-100">{payment.items?.length || 0} items</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">${payment.totalAmount}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                        {payment.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                                      {new Date(payment.updatedAt).toLocaleDateString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <Utensils className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                            <p className="text-gray-500 dark:text-gray-400">No food order payments found</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Analytics Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Analytics Dashboard</h2>
                  <button
                    onClick={() => fetchAnalytics()}
                    className="btn btn-outline"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                {/* Analytics Summary */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="text-white card bg-gradient-to-r from-blue-600 to-blue-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-100">Revenue (30 Days)</p>
                        <p className="text-2xl font-bold">
                          ${analytics.revenue?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0}
                        </p>
                        <p className="text-xs text-blue-100">
                          {analytics.revenue?.reduce((sum, item) => sum + (item.bookings || 0), 0) || 0} bookings
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-200" />
                    </div>
                  </div>

                  <div className="text-white card bg-gradient-to-r from-green-600 to-green-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-100">Most Popular Room</p>
                        <p className="text-2xl font-bold">
                          {analytics.roomTypes?.length > 0 
                            ? analytics.roomTypes.sort((a, b) => b.count - a.count)[0]?._id[0] || 'N/A'
                            : 'N/A'
                          }
                        </p>
                        <p className="text-xs text-green-100">
                          {analytics.roomTypes?.length > 0 
                            ? `${analytics.roomTypes.sort((a, b) => b.count - a.count)[0]?.count || 0} bookings`
                            : 'No data'
                          }
                        </p>
                      </div>
                      <Bed className="w-8 h-8 text-green-200" />
                    </div>
                  </div>

                  <div className="text-white card bg-gradient-to-r from-purple-600 to-purple-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-100">New Customers (30 Days)</p>
                        <p className="text-2xl font-bold">
                          {analytics.customers?.reduce((sum, item) => sum + (item.newCustomers || 0), 0) || 0}
                        </p>
                        <p className="text-xs text-purple-100">
                          Customer growth
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div className="card">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Revenue Trend (Last 30 Days)</h3>
                  <div className="p-4 rounded-lg h-80 bg-gray-50 dark:bg-gray-700">
                    {analytics.revenue?.length > 0 ? (
                      <div className="flex items-end h-full space-x-2">
                        {analytics.revenue.map((day, index) => {
                          const height = day.revenue > 0 
                            ? (day.revenue / Math.max(...analytics.revenue.map(d => d.revenue))) * 100 
                            : 0;
                          
                          return (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div 
                                className="w-full bg-blue-500 rounded-t"
                                style={{ height: `${height}%` }}
                              ></div>
                              <div className="w-full mt-2 text-xs text-center text-gray-600 truncate dark:text-gray-400">
                                {new Date(day._id).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400">No revenue data available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Room Type Distribution */}
                <div className="card">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Room Type Distribution</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Bookings by Room Type</h4>
                      {analytics.roomTypes?.length > 0 ? (
                        <div className="space-y-3">
                          {analytics.roomTypes.map((type, index) => {
                            const percentage = (type.count / analytics.roomTypes.reduce((sum, t) => sum + t.count, 0)) * 100;
                            
                            return (
                              <div key={index}>
                                <div className="flex justify-between mb-1 text-sm">
                                  <span className="capitalize">{type._id[0] || 'Unknown'}</span>
                                  <span>{type.count} bookings ({percentage.toFixed(1)}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-40">
                          <p className="text-gray-500 dark:text-gray-400">No room type data available</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Revenue by Room Type</h4>
                      {analytics.roomTypes?.length > 0 ? (
                        <div className="space-y-3">
                          {analytics.roomTypes.map((type, index) => {
                            const percentage = (type.revenue / analytics.roomTypes.reduce((sum, t) => sum + t.revenue, 0)) * 100;
                            
                            return (
                              <div key={index}>
                                <div className="flex justify-between mb-1 text-sm">
                                  <span className="capitalize">{type._id[0] || 'Unknown'}</span>
                                  <span>${type.revenue} ({percentage.toFixed(1)}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                                  <div 
                                    className="bg-green-600 h-2.5 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-40">
                          <p className="text-gray-500 dark:text-gray-400">No revenue data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Growth */}
                <div className="card">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Customer Growth (Last 30 Days)</h3>
                  <div className="p-4 rounded-lg h-60 bg-gray-50 dark:bg-gray-700">
                    {analytics.customers?.length > 0 ? (
                      <div className="flex items-end h-full space-x-2">
                        {analytics.customers.map((day, index) => {
                          const height = day.newCustomers > 0 
                            ? (day.newCustomers / Math.max(...analytics.customers.map(d => d.newCustomers))) * 100 
                            : 0;
                          
                          return (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div 
                                className="w-full bg-purple-500 rounded-t"
                                style={{ height: `${height}%` }}
                              ></div>
                              <div className="w-full mt-2 text-xs text-center text-gray-600 truncate dark:text-gray-400">
                                {new Date(day._id).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400">No customer growth data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Settings Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">System Settings</h2>
                </div>

                {/* Settings Sections */}
                <div className="card">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">General Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Hostel Information</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Update hostel name, address, and contact details</p>
                      </div>
                      <button className="btn btn-sm btn-outline">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Email Notifications</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Configure email templates and notification settings</p>
                      </div>
                      <button className="btn btn-sm btn-outline">
                        <Edit className="w-4 h-4" />
                        Configure
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Payment Settings</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Configure payment methods and processing options</p>
                      </div>
                      <button className="btn btn-sm btn-outline">
                        <Edit className="w-4 h-4" />
                        Configure
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">System Maintenance</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Database Backup</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage database backups</p>
                      </div>
                      <button className="btn btn-sm btn-primary">
                        Create Backup
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">System Logs</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">View and download system logs</p>
                      </div>
                      <button className="btn btn-sm btn-outline">
                        View Logs
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Clear Cache</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Clear system cache to improve performance</p>
                      </div>
                      <button className="btn btn-sm btn-outline">
                        Clear Cache
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Password Policy</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Configure password requirements and expiration</p>
                      </div>
                      <button className="btn btn-sm btn-outline">
                        <Edit className="w-4 h-4" />
                        Configure
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Enable or disable 2FA for admin accounts</p>
                      </div>
                      <button className="btn btn-sm btn-outline">
                        Configure
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">API Access</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Manage API keys and access permissions</p>
                      </div>
                      <button className="btn btn-sm btn-outline">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;