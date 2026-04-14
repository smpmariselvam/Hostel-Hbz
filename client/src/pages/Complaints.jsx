import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Calendar,
  Filter,
  Search,
  X
} from 'lucide-react';

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('/api/complaints/my-complaints');
      setComplaints(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    
    if (!newComplaint.title.trim() || !newComplaint.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post('/api/complaints', newComplaint);
      setComplaints([response.data, ...complaints]);
      setNewComplaint({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium'
      });
      setShowNewComplaint(false);
      toast.success('Complaint submitted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    }

    setSubmitting(false);
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

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      'in-progress': AlertCircle,
      resolved: CheckCircle,
      closed: CheckCircle
    };
    return icons[status] || Clock;
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === 'all') return true;
    return complaint.status === filter;
  });

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'room', label: 'Room Issues' },
    { value: 'service', label: 'Service' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'billing', label: 'Billing' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'staff', label: 'Staff Behavior' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
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
      <div className="container max-w-4xl">
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
                Complaints & Feedback
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Submit and track your complaints and feedback</p>
            </div>
            
            <button
              onClick={() => setShowNewComplaint(true)}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5" />
              New Complaint
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold">Filter Complaints</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'in-progress', 'resolved', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </motion.div>

        {/* New Complaint Modal */}
        <AnimatePresence>
          {showNewComplaint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowNewComplaint(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Submit New Complaint</h2>
                    <button
                      onClick={() => setShowNewComplaint(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitComplaint} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">Category *</label>
                        <select
                          value={newComplaint.category}
                          onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                          className="input"
                          required
                        >
                          {categories.map(category => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Priority *</label>
                        <select
                          value={newComplaint.priority}
                          onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value })}
                          className="input"
                          required
                        >
                          {priorities.map(priority => (
                            <option key={priority.value} value={priority.value}>
                              {priority.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Title *</label>
                      <input
                        type="text"
                        value={newComplaint.title}
                        onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                        className="input"
                        placeholder="Brief description of your complaint"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description *</label>
                      <textarea
                        value={newComplaint.description}
                        onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                        className="input"
                        rows="5"
                        placeholder="Please provide detailed information about your complaint..."
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowNewComplaint(false)}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                      >
                        {submitting ? (
                          <>
                            <div className="loading-spinner w-4 h-4" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit Complaint
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Complaints List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {filteredComplaints.length === 0 ? (
            <div className="card text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No complaints found
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                {filter === 'all' 
                  ? "You haven't submitted any complaints yet."
                  : `No ${filter.replace('-', ' ')} complaints found.`
                }
              </p>
              <button
                onClick={() => setShowNewComplaint(true)}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5" />
                Submit Your First Complaint
              </button>
            </div>
          ) : (
            filteredComplaints.map((complaint) => {
              const StatusIcon = getStatusIcon(complaint.status);
              
              return (
                <motion.div
                  key={complaint._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        complaint.status === 'resolved' || complaint.status === 'closed'
                          ? 'bg-green-100 dark:bg-green-900'
                          : complaint.status === 'in-progress'
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : 'bg-yellow-100 dark:bg-yellow-900'
                      }`}>
                        <StatusIcon className={`w-5 h-5 ${
                          complaint.status === 'resolved' || complaint.status === 'closed'
                            ? 'text-green-600 dark:text-green-400'
                            : complaint.status === 'in-progress'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                          {complaint.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="capitalize">{complaint.category}</span>
                          <span className={`font-medium ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority} priority
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          {complaint.description}
                        </p>
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium status-badge ${getStatusColor(complaint.status)}`}>
                      {complaint.status.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Response */}
                  {complaint.response && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                            Staff Response
                          </p>
                          <p className="text-blue-700 dark:text-blue-300 text-sm">
                            {complaint.response}
                          </p>
                          {complaint.respondedAt && (
                            <p className="text-blue-600 dark:text-blue-400 text-xs mt-2">
                              Responded on {new Date(complaint.respondedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Complaint ID */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Complaint ID: {complaint._id}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
        >
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Need Help?</h3>
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            Our team is here to help resolve your concerns. For urgent matters, please contact us directly.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-blue-800 dark:text-blue-200">Emergency</div>
              <div className="text-blue-600 dark:text-blue-400">Call: (555) 123-4567</div>
            </div>
            <div>
              <div className="font-medium text-blue-800 dark:text-blue-200">Email Support</div>
              <div className="text-blue-600 dark:text-blue-400">support@hostelhub.com</div>
            </div>
            <div>
              <div className="font-medium text-blue-800 dark:text-blue-200">Live Chat</div>
              <div className="text-blue-600 dark:text-blue-400">Available 24/7</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Complaints;