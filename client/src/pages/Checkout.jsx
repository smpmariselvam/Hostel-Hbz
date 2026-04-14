import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import QRCodePayment from '../components/Payment/QRCodePayment';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Smartphone, 
  DollarSign,
  Clock,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orderData, setOrderData] = useState({
    deliveryLocation: '',
    specialInstructions: '',
    paymentMethod: 'qr_code'
  });
  const [showQRPayment, setShowQRPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    if (!orderData.deliveryLocation.trim()) {
      toast.error('Please enter delivery location');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          foodId: item.foodId,
          quantity: item.quantity
        })),
        deliveryLocation: orderData.deliveryLocation,
        specialInstructions: orderData.specialInstructions
      };

      const response = await axios.post('/api/food/orders', orderPayload);
      const newOrderId = response.data._id;
      setOrderId(newOrderId);
      
      if (orderData.paymentMethod === 'qr_code') {
        setShowQRPayment(true);
      } else {
        // Handle other payment methods
        handlePaymentSuccess({
          orderId: newOrderId,
          amount: getCartTotal(),
          paymentMethod: orderData.paymentMethod
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }

    setLoading(false);
  };

  const handlePaymentSuccess = (paymentData) => {
    clearCart();
    toast.success('Order placed successfully!');
    navigate('/customer/dashboard', { 
      state: { 
        message: 'Your order has been placed and will be prepared shortly.' 
      }
    });
  };

  const handlePaymentCancel = () => {
    setShowQRPayment(false);
    setOrderId(null);
  };

  if (showQRPayment && orderId) {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-2xl">
          <div className="card">
            <QRCodePayment
              amount={getCartTotal()}
              orderId={orderId}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentCancel={handlePaymentCancel}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-2 py-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
          <p className="text-gray-600">Review your order and complete payment</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Your cart is empty</p>
                  <button
                    onClick={() => navigate('/food-menu')}
                    className="btn btn-primary mt-4"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.foodId} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span>{user?.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{user?.phone}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Details & Payment */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Delivery Information */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Delivery Location *
                  </label>
                  <input
                    type="text"
                    name="deliveryLocation"
                    value={orderData.deliveryLocation}
                    onChange={handleInputChange}
                    placeholder="e.g., Room 101, Lobby, Pool Area"
                    className="input"
                    required
                    aria-describedby="location-help"
                  />
                  <p id="location-help" className="form-help">
                    Specify where you'd like your order delivered
                  </p>
                </div>

                <div>
                  <label className="form-label">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Special Instructions
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={orderData.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Any special requests or dietary requirements..."
                    rows="3"
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="qr_code"
                    checked={orderData.paymentMethod === 'qr_code'}
                    onChange={handleInputChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">QR Code Payment</div>
                    <div className="text-sm text-gray-600">Pay using your mobile payment app</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors opacity-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    disabled
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Coming soon</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors opacity-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    disabled
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when your order arrives</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading || cartItems.length === 0}
              className="w-full btn btn-primary btn-lg"
            >
              {loading ? (
                <>
                  <div className="loading-spinner w-5 h-5" />
                  Placing Order...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Place Order - ${getCartTotal().toFixed(2)}
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;