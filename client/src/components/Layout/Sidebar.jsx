import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useNotifications } from '../../contexts/NotificationContext';
import ThemeToggle from './ThemeToggle';
import { 
  Home, 
  Bed, 
  Coffee, 
  LogOut, 
  User, 
  MessageCircle,
  ShoppingCart,
  Settings,
  Bell,
  X,
  ChevronRight,
  Star,
  CreditCard,
  FileText,
  Menu,
  MessageSquare,
  Shield,
  Users,
  BarChart3
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const { notifications, unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'staff':
        return '/staff/dashboard';
      case 'customer':
        return '/customer/dashboard';
      default:
        return '/';
    }
  };

  const cartItemCount = getCartItemCount();

  const menuItems = [
    {
      id: 'main',
      title: 'Main Menu',
      items: [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: Bed, label: 'Rooms', path: '/rooms' },
        { icon: Coffee, label: 'Facilities', path: '/facilities' },
        { icon: Coffee, label: 'Food Menu', path: '/food-menu' },
      ]
    },
    {
      id: 'account',
      title: 'Account',
      items: [
        { icon: User, label: 'Dashboard', path: getDashboardLink() },
        { icon: Settings, label: 'Profile Settings', path: '/profile' },
        { icon: Bell, label: 'Notifications', path: '/notifications', badge: unreadCount },
      ]
    }
  ];

  // Add admin-specific menu items
  if (user?.role === 'admin') {
    menuItems.push({
      id: 'admin',
      title: 'Admin Tools',
      items: [
        { icon: BarChart3, label: 'Admin Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'User Management', path: '/admin/users' },
        { icon: MessageSquare, label: 'Complaints', path: '/admin/complaints' },
        { icon: Shield, label: 'System Settings', path: '/admin/settings' },
      ]
    });
  }

  if (user?.role === 'customer') {
    menuItems[0].items.push(
      { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: cartItemCount },
      { icon: FileText, label: 'Complaints', path: '/complaints' }
    );
  }

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
            className="fixed right-0 top-0 h-full w-full max-w-sm sm:w-80 bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col transition-colors duration-200"
            role="navigation"
            aria-label="Main navigation sidebar"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Bed className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">HostelHub</h2>
                  {user && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate max-w-32 sm:max-w-none">
                      Welcome, {user.name}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <nav className="space-y-6">
                {menuItems.map((section) => (
                  <div key={section.id}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={onClose}
                          className="flex items-center justify-between p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                            <span className="font-medium text-sm sm:text-base">{item.label}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {item.badge > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                                {item.badge > 99 ? '99+' : item.badge}
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Chat */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Support
                  </h3>
                  <Link
                    to="/chat"
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      <span className="font-medium text-sm sm:text-base">Chat Support</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </Link>
                </div>
              </nav>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                <ThemeToggle showLabel={false} size="md" />
              </div>

              {/* User Info */}
              {user && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-gray-200 text-sm sm:text-base truncate">
                        {user.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full btn btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white dark:text-red-400 dark:border-red-400 dark:hover:bg-red-500 dark:hover:text-white text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;