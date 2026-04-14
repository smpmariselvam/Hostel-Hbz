import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationContext';
import { 
  Bell, 
  Check, 
  X, 
  Trash2, 
  Filter,
  Calendar,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Notifications = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotification, 
    clearAllNotifications 
  } = useNotifications();
  
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedType, setSelectedType] = useState('all'); // all, booking, order, system

  const getNotificationIcon = (type) => {
    const icons = {
      booking: Calendar,
      order: CheckCircle,
      system: Info,
      alert: AlertCircle,
      error: XCircle
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') {
      return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
    }
    
    const colors = {
      booking: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20',
      order: 'border-l-green-500 bg-green-50 dark:bg-green-900/20',
      system: 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20',
      alert: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      error: 'border-l-red-500 bg-red-50 dark:bg-red-900/20'
    };
    
    return colors[type] || 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (filter === 'read' && !notification.read) return false;
    if (selectedType !== 'all' && notification.type !== selectedType) return false;
    return true;
  });

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return time.toLocaleDateString();
  };

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
                <Bell className="w-8 h-8" />
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Stay updated with your latest activities</p>
            </div>
            
            {notifications.length > 0 && (
              <div className="flex items-center space-x-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="btn btn-sm btn-outline"
                  >
                    <Check className="w-4 h-4" />
                    Mark All Read
                  </button>
                )}
                <button
                  onClick={clearAllNotifications}
                  className="btn btn-sm btn-danger"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            )}
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
            <h3 className="text-lg font-semibold">Filter Notifications</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input"
              >
                <option value="all">All Types</option>
                <option value="booking">Bookings</option>
                <option value="order">Orders</option>
                <option value="system">System</option>
                <option value="alert">Alerts</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredNotifications.length === 0 ? (
            <div className="card text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : "You don't have any notifications yet."
                }
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`card border-l-4 ${getNotificationColor(notification.type, notification.priority)} ${
                      !notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.priority === 'high' 
                          ? 'bg-red-100 dark:bg-red-900' 
                          : 'bg-blue-100 dark:bg-blue-900'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          notification.priority === 'high' 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-blue-600 dark:text-blue-400'
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className={`text-sm font-medium ${
                              !notification.read 
                                ? 'text-gray-900 dark:text-gray-100' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className={`mt-1 text-sm ${
                              !notification.read 
                                ? 'text-gray-700 dark:text-gray-300' 
                                : 'text-gray-500 dark:text-gray-500'
                            }`}>
                              {notification.message}
                            </p>
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => clearNotification(notification.id)}
                              className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                              aria-label="Delete notification"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Summary */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 card bg-gray-50 dark:bg-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notification Summary
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {notifications.length} total • {unreadCount} unread • {notifications.length - unreadCount} read
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Unread</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Read</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;