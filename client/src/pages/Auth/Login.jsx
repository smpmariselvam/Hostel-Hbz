import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { LogIn, Eye, EyeOff, Mail, Lock, Shield, Users, User } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('customer'); // customer, staff, admin
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Login successful!');
      
      // Redirect based on role
      switch (result.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'staff':
          navigate('/staff/dashboard');
          break;
        case 'customer':
          navigate('/customer/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'admin':
        return <Shield className="w-5 h-5" />;
      case 'staff':
        return <Users className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getTabColor = (tab) => {
    switch (tab) {
      case 'admin':
        return 'from-red-600 to-orange-600';
      case 'staff':
        return 'from-teal-600 to-green-600';
      default:
        return 'from-blue-600 to-indigo-600';
    }
  };

  const getTabTitle = (tab) => {
    switch (tab) {
      case 'admin':
        return 'Admin Login';
      case 'staff':
        return 'Staff Login';
      default:
        return 'Customer Login';
    }
  };

  const getTabDescription = (tab) => {
    switch (tab) {
      case 'admin':
        return 'Access administrative controls';
      case 'staff':
        return 'Manage hostel operations';
      default:
        return 'Access your bookings and services';
    }
  };

  const getPlaceholderEmail = (tab) => {
    switch (tab) {
      case 'admin':
        return 'admin@hostel.com';
      case 'staff':
        return 'staff@hostel.com';
      default:
        return 'customer@hostel.com';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className={`w-20 h-20 bg-gradient-to-r ${getTabColor(activeTab)} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {getTabIcon(activeTab)}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{getTabTitle(activeTab)}</h2>
          <p className="mt-2 text-gray-300">{getTabDescription(activeTab)}</p>
        </motion.div>

        {/* Account Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex rounded-lg overflow-hidden shadow-lg"
        >
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === 'customer' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User className="w-4 h-4 mx-auto mb-1" />
            Customer
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === 'staff' 
                ? 'bg-teal-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4 mx-auto mb-1" />
            Staff
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === 'admin' 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Shield className="w-4 h-4 mx-auto mb-1" />
            Admin
          </button>
        </motion.div>

        <motion.form
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input pl-12"
                  placeholder={`Enter your email (e.g., ${getPlaceholderEmail(activeTab)})`}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input pl-12 pr-12"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {activeTab === 'staff' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">Staff Access Notice</h3>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                    Staff accounts require admin approval before access is granted.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full btn ${
                activeTab === 'admin' 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700' 
                  : activeTab === 'staff'
                  ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white hover:from-teal-700 hover:to-green-700'
                  : 'btn-primary'
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </div>

          <div className="text-center space-y-2">
            {activeTab === 'customer' && (
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up here
                </Link>
              </p>
            )}
            {activeTab === 'staff' && (
              <p className="text-gray-600 dark:text-gray-400">
                Need staff access?{' '}
                <Link to="/register" className="text-teal-600 hover:text-teal-700 font-medium">
                  Register here
                </Link>
              </p>
            )}
            <Link to="/" className="block text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        </motion.form>

        {/* Demo Account */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 card bg-gray-800 text-white"
        >
          <h3 className="text-lg font-semibold mb-4">Demo {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Account</h3>
          <div className="text-sm">
            <div className="flex justify-between mb-2">
              <span>Email:</span>
              <span className="font-mono">{getPlaceholderEmail(activeTab)}</span>
            </div>
            <div className="flex justify-between">
              <span>Password:</span>
              <span className="font-mono">
                {activeTab === 'admin' ? 'admin123' : activeTab === 'staff' ? 'staff123' : 'customer123'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Add AlertCircle component
const AlertCircle = ({ className, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

export default Login;