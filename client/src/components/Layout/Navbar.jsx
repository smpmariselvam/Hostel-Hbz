import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useNotifications } from '../../contexts/NotificationContext';
import ThemeToggle from './ThemeToggle';
import Sidebar from './Sidebar';
import NotificationSidebar from './NotificationSidebar';
import { 
  Bed, 
  Menu,
  ShoppingCart,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const { getCartItemCount, setIsCartOpen } = useCart();
  const { unreadCount } = useNotifications();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);

  const cartItemCount = getCartItemCount();

  // Get API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCartOpen(true);
  };

  const handleNotificationClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNotificationSidebarOpen(true);
  };

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-30 transition-colors duration-200" role="navigation" aria-label="Main navigation">
        <div className="container">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo */}
            <Link 
              to={isAuthenticated() ? "/home" : "/"} 
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1 transition-colors duration-200"
              aria-label="HostelHub - Go to homepage"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Bed className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">HostelHub</span>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Theme Toggle for Desktop */}
              <div className="hidden md:block">
                <ThemeToggle showLabel={false} size="sm" />
              </div>

              {isAuthenticated() && (
                <>
                  {/* Cart Icon (only for customers) */}
                  {user?.role === 'customer' && (
                    <button
                      onClick={handleCartClick}
                      className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                      aria-label={`Shopping cart with ${cartItemCount} items`}
                    >
                      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                      {cartItemCount > 0 && (
                        <span className="cart-badge" aria-hidden="true">
                          {cartItemCount > 99 ? '99+' : cartItemCount}
                        </span>
                      )}
                    </button>
                  )}

                  {/* Notifications */}
                  <button
                    onClick={handleNotificationClick}
                    className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                    aria-label={`Notifications - ${unreadCount} unread`}
                  >
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                    {unreadCount > 0 && (
                      <span className="notification-badge" aria-hidden="true">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* Menu Button */}
              <button 
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={isSidebarOpen}
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Notification Sidebar */}
      <NotificationSidebar
        isOpen={isNotificationSidebarOpen}
        onClose={() => setIsNotificationSidebarOpen(false)}
      />
    </>
  );
};

export default Navbar;