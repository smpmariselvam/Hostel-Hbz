import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../../contexts/NotificationContext';
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

const NotificationSidebar = ({ isOpen, onClose }) => {
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

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: '100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col transition-colors duration-200"
            role="dialog"
            aria-labelledby="notifications-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bell className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <h2 id="notifications-title" className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notifications</h2>
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                    aria-label="Mark all as read"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Close notifications"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter</span>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-red-600 dark:text-red-400 text-sm hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    filter === 'unread'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    filter === 'read'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Read
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
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
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => {
                    const IconComponent = getNotificationIcon(notification.type);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`border-l-4 rounded-lg p-4 ${getNotificationColor(notification.type, notification.priority)} ${
                          !notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Icon */}
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            notification.priority === 'high' 
                              ? 'bg-red-100 dark:bg-red-900' 
                              : 'bg-blue-100 dark:bg-blue-900'
                          }`}>
                            <IconComponent className={`w-4 h-4 ${
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
                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors"
                                    aria-label="Mark as read"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => clearNotification(notification.id)}
                                  className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
                                  aria-label="Delete notification"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-600 dark:text-gray-400">
                    {notifications.length} total • {unreadCount} unread
                  </div>
                  <button
                    onClick={markAllAsRead}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    disabled={unreadCount === 0}
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationSidebar;