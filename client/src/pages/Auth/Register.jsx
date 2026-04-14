import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  UserPlus, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin,
  Users as UsersIcon
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    phone: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      toast.success('Registration successful!');
      // Redirect based on role
      switch (formData.role) {
        case 'staff':
          navigate('/staff/dashboard');
          break;
        default:
          navigate('/customer/dashboard');
      }
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'staff':
        return <UsersIcon className="w-5 h-5 text-teal-500" />;
      default:
        return <User className="w-5 h-5 text-blue-500" />;
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'staff':
        return 'Staff access to manage bookings and guest services (requires admin approval)';
      default:
        return 'Customer access to book rooms and order services';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="w-full max-w-md space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-teal-600">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-gray-300">Join HostelHub today</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 mt-8 space-y-6 bg-white shadow-2xl dark:bg-gray-800 rounded-xl"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="pl-12 input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-12 input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="pl-12 input"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="pl-12 input"
                  placeholder="Enter your address (optional)"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Account Type
              </label>
              <div className="relative">
                <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                  {getRoleIcon(formData.role)}
                </div>
                <select
                  id="role"
                  name="role"
                  className="pl-12 input"
                  value={formData.role}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {getRoleDescription(formData.role)}
              </p>
              {formData.role === 'staff' && (
                <p className="flex items-center mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Staff accounts require admin approval before access is granted.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="pl-12 pr-12 input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <button
                  type="button"
                  className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="pl-12 pr-12 input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                />
                <button
                  type="button"
                  className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary"
            >
              {loading ? (
                <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </div>

          <div className="space-y-2 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
                Sign in here
              </Link>
            </p>
            <Link to="/" className="block font-medium text-blue-600 hover:text-blue-700">
              ← Back to Home
            </Link>
          </div>
        </motion.form>

        {/* Demo Accounts Info
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-white bg-gray-800 card"
        >
          <h3 className="mb-4 text-lg font-semibold">Demo Accounts Available</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Admin:</span>
              <span className="font-mono text-gray-100">admin@hostel.com / admin123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Staff:</span>
              <span className="font-mono text-gray-100">staff@hostel.com / staff123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Customer:</span>
              <span className="font-mono text-gray-100">customer@hostel.com / customer123</span>
            </div>
          </div>
        </motion.div> */}
      </div>
    </div>
  );
};

export default Register;