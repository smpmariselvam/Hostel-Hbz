import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Eye, EyeOff, Mail, Lock } from 'lucide-react';

const CustomerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
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
      if (result.user.role !== 'customer') {
        toast.error('This login is for customers only');
        setLoading(false);
        return;
      }
      
      toast.success('Login successful!');
      navigate('/customer/dashboard');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-indigo-900">
      <div className="w-full max-w-md space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-white">Customer Login</h2>
          <p className="mt-2 text-gray-300">Welcome back to HostelHub</p>
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
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 transform -translate-y-1/2 p-text-gray-400 left-3 top-1/2" />
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
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading ? (
                <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </div>

          <div className="space-y-2 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700">
                Sign up here
              </Link>
            </p>
            <Link to="/" className="block font-medium text-blue-600 hover:text-blue-700">
              ← Back to Home
            </Link>
          </div>
        </motion.form>

        {/* Demo Account
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-white bg-gray-800 card"
        >
          <h3 className="mb-4 text-lg font-semibold">Demo Customer Account</h3>
          <div className="text-sm">
            <div className="flex justify-between mb-2">
              <span>Email:</span>
              <span className="font-mono">customer@hostel.com</span>
            </div>
            <div className="flex justify-between">
              <span>Password:</span>
              <span className="font-mono">customer123</span>
            </div>
          </div>
        </motion.div> */}
      </div>
    </div>
  );
};

export default CustomerLogin;