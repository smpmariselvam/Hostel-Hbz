import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  MessageSquare,
  Search,
  Filter,
  Eye,
  Send,
  User,
  Mail,
  Phone,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  X,
  Calendar,
  Tag,
  Flag,
  ArrowUpDown,
  Download,
  Trash2,
  Edit3
} from 'lucide-react';

const AdminComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [sending, setSending] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    priority: '',
    dateRange: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    highPriority: 0
  });

  useEffect(() => {
    fetchComplaints();
  }, [filters, pagination.page]);

  useEffect(() => {
    calculateStats();
  }, [complaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching complaints with filters:', filters);
      console.log('📄 Pagination:', pagination);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      });

      console.log('📡 Request URL:', `/api/admin/complaints?${params}`);

      const response = await axios.get(`/api/admin/complaints?${params}`);
      
      console.log('✅ Response received:', response.data);
      
      if (response.data.success) {
        setComplaints(response.data.complaints || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0
        }));
        
        console.log('📊 Complaints loaded:', response.data.complaints?.length || 0);
      } else {
        console.error('❌ API returned success: false');
        toast.error('Failed to load complaints');
      }
    } catch (error) {
      console.error('❌ Error fetching complaints:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      if (error.response?.status === 404) {
        toast.error('Complaints endpoint not found. Please check server configuration.');
      } else if (error.response?.status === 401) {
        toast.error('Unauthorized. Please login again.');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.');
      } else {
        toast.error('Failed to load complaints. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const newStats = {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'pending').length,
      inProgress: complaints.filter(c => c.status === 'in-progress').length,
      resolved: complaints.filter(c => c.status === 'resolved').length,
      closed: complaints.filter(c => c.status === 'closed').length,
      highPriority: complaints.filter(c => c.priority === 'high').length
    };
    setStats(newStats);
  };

  const handleFilterChange = (key, value) => {
    console.log(`🔧 Filter changed: ${key} = ${value}`);
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (sortBy) => {
    const newOrder = filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    console.log(`📊 Sort changed: ${sortBy} ${newOrder}`);
    setFilters(prev => ({ ...prev, sortBy, sortOrder: newOrder }));
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      console.log(`🔄 Updating complaint ${complaintId} status to:`, newStatus);
      await axios.put(`/api/admin/complaints/${complaintId}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchComplaints();
      if (selectedComplaint && selectedComplaint._id === complaintId) {
        setSelectedComplaint(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleSendResponse = async (complaintId, response) => {
    if (!response.trim()) {
      toast.error('Please enter a response');
      return;
    }

    try {
      setSending(true);
      console.log(`💬 Sending response to complaint ${complaintId}`);
      await axios.put(`/api/admin/complaints/${complaintId}/respond`, { response });
      toast.success('Response sent successfully');
      setResponseText('');
      fetchComplaints();
      if (selectedComplaint && selectedComplaint._id === complaintId) {
        setSelectedComplaint(prev => ({ 
          ...prev, 
          response, 
          respondedAt: new Date(),
          status: 'resolved'
        }));
      }
    } catch (error) {
      console.error('❌ Error sending response:', error);
      toast.error('Failed to send response');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    if (!window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      return;
    }

    try {
      console.log(`🗑️ Deleting complaint ${complaintId}`);
      await axios.delete(`/api/admin/complaints/${complaintId}`);
      toast.success('Complaint deleted successfully');
      fetchComplaints();
      if (selectedComplaint && selectedComplaint._id === complaintId) {
        setShowDetailsModal(false);
        setSelectedComplaint(null);
      }
    } catch (error) {
      console.error('❌ Error deleting complaint:', error);
      toast.error('Failed to delete complaint');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
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

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4"  />;
    }
  };

  const exportComplaints = () => {
    const csvContent = [
      ['ID', 'Customer', 'Email', 'Title', 'Category', 'Priority', 'Status', 'Created Date', 'Response'],
      ...complaints.map(complaint => [
        complaint._id,
        complaint.customer?.name || '',
        complaint.customer?.email || '',
        complaint.title,
        complaint.category,
        complaint.priority,
        complaint.status,
        new Date(complaint.createdAt).toLocaleDateString(),
        complaint.response || 'No response'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaints-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      category: '',
      priority: '',
      dateRange: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="min-h-screen py-8" id="main-content">
      <div className="container max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
                <MessageSquare className="w-8 h-8" />
                Complaints Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and respond to customer complaints and feedback
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={exportComplaints}
                className="btn btn-outline"
                disabled={complaints.length === 0}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={fetchComplaints}
                className="btn btn-primary"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          <div className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="text-center">
              <p className="text-blue-100 text-sm">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
          <div className="card bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
            <div className="text-center">
              <p className="text-yellow-100 text-sm">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
          <div className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="text-center">
              <p className="text-blue-100 text-sm">In Progress</p>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </div>
          </div>
          <div className="card bg-gradient-to-r from-green-600 to-green-700 text-white">
            <div className="text-center">
              <p className="text-green-100 text-sm">Resolved</p>
              <p className="text-2xl font-bold">{stats.resolved}</p>
            </div>
          </div>
          <div className="card bg-gradient-to-r from-gray-600 to-gray-700 text-white">
            <div className="text-center">
              <p className="text-gray-100 text-sm">Closed</p>
              <p className="text-2xl font-bold">{stats.closed}</p>
            </div>
          </div>
          <div className="card bg-gradient-to-r from-red-600 to-red-700 text-white">
            <div className="text-center">
              <p className="text-red-100 text-sm">High Priority</p>
              <p className="text-2xl font-bold">{stats.highPriority}</p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold">Filter Complaints</h3>
            <button
              onClick={clearFilters}
              className="ml-auto text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                className="input pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <select
              className="input"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              className="input"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
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
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              className="input"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="createdAt">Date Created</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="category">Category</option>
            </select>

            <button
              onClick={() => handleSortChange(filters.sortBy)}
              className="btn btn-outline flex items-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              {filters.sortOrder === 'desc' ? 'Desc' : 'Asc'}
            </button>
          </div>
        </motion.div>

        {/* Complaints List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner w-8 h-8 border-b-2 border-blue-600"></div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="card text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No complaints found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                No complaints match your current filters.
              </p>
            </div>
          ) : (
            complaints.map((complaint) => (
              <div key={complaint._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Priority Indicator */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      complaint.priority === 'high' 
                        ? 'bg-red-100 dark:bg-red-900' 
                        : complaint.priority === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900'
                        : 'bg-green-100 dark:bg-green-900'
                    }`}>
                      <div className={getPriorityColor(complaint.priority)}>
                        {getPriorityIcon(complaint.priority)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {complaint.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(complaint.priority)} bg-opacity-10`}>
                          <Flag className="w-3 h-3 inline mr-1" />
                          {complaint.priority}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs capitalize">
                          <Tag className="w-3 h-3 inline mr-1" />
                          {complaint.category}
                        </span>
                      </div>
                      
                      {/* Customer Info */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{complaint.customer?.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{complaint.customer?.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                        {complaint.description}
                      </p>

                      {/* Response Preview */}
                      {complaint.response && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
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
                            onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setShowDetailsModal(true);
                            }}
                            className="btn btn-sm btn-outline"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => handleDeleteComplaint(complaint._id)}
                            className="btn btn-sm btn-danger"
                          >
                            <Trash2 className="w-4 h-4" />
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
          )}
        </motion.div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} complaints
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="btn btn-sm btn-outline"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="btn btn-sm btn-outline"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Complaint Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedComplaint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDetailsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      Complaint Details
                    </h2>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Complaint Details */}
                    <div className="space-y-6">
                      {/* Complaint Info */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                          {selectedComplaint.title}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
                            <p className="font-medium capitalize">{selectedComplaint.category}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
                            <p className={`font-medium capitalize ${getPriorityColor(selectedComplaint.priority)}`}>
                              {selectedComplaint.priority}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedComplaint.status)}`}>
                              {selectedComplaint.status.replace('-', ' ')}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Created:</span>
                            <p className="font-medium">{new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Description:</span>
                          <p className="mt-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            {selectedComplaint.description}
                          </p>
                        </div>
                      </div>

                      {/* Customer Information */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Customer Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">Name:</span>
                              <p className="font-medium">{selectedComplaint.customer?.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                              <p className="font-medium">{selectedComplaint.customer?.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
                              <p className="font-medium">{selectedComplaint.customer?.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Response Section */}
                    <div className="space-y-6">
                      {/* Existing Response */}
                      {selectedComplaint.response ? (
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Current Response</h4>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                            <p className="text-blue-700 dark:text-blue-300 mb-2">{selectedComplaint.response}</p>
                            {selectedComplaint.respondedAt && (
                              <p className="text-blue-600 dark:text-blue-400 text-sm">
                                Responded on {new Date(selectedComplaint.respondedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          
                          {/* Update Response */}
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Update Response:
                            </label>
                            <textarea
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              placeholder="Enter updated response..."
                              rows="4"
                              className="input"
                            />
                            <button
                              onClick={() => handleSendResponse(selectedComplaint._id, responseText)}
                              disabled={sending || !responseText.trim()}
                              className="mt-3 btn btn-primary w-full"
                            >
                              {sending ? (
                                <>
                                  <div className="loading-spinner w-4 h-4" />
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  Update Response
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Send Response</h4>
                          <textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Type your response to the customer..."
                            rows="6"
                            className="input"
                          />
                          <button
                            onClick={() => handleSendResponse(selectedComplaint._id, responseText)}
                            disabled={sending || !responseText.trim()}
                            className="mt-3 btn btn-primary w-full"
                          >
                            {sending ? (
                              <>
                                <div className="loading-spinner w-4 h-4" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                Send Response
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Status Management */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Status Management</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Current Status:
                            </label>
                            <select
                              value={selectedComplaint.status}
                              onChange={(e) => handleStatusUpdate(selectedComplaint._id, e.target.value)}
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
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Complaint Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Complaint ID:</span>
                            <span className="font-mono text-xs">{selectedComplaint._id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Created:</span>
                            <span>{new Date(selectedComplaint.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                            <span>{new Date(selectedComplaint.updatedAt).toLocaleString()}</span>
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
    </div>
  );
};

export default AdminComplaints;