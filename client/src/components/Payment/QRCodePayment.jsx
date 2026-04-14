import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { Check, Copy, RefreshCw, CreditCard, Smartphone } from 'lucide-react';
import { toast } from 'react-hot-toast';

const QRCodePayment = ({ amount, orderId, onPaymentSuccess, onPaymentCancel }) => {
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generatePaymentQR();
  }, [amount, orderId]);

  useEffect(() => {
    if (timeLeft > 0 && paymentStatus === 'pending') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setPaymentStatus('expired');
    }
  }, [timeLeft, paymentStatus]);

  const generatePaymentQR = () => {
    const payment = {
      orderId,
      amount,
      currency: 'USD',
      merchantId: 'HOsTEL_HUB_001',
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
      paymentUrl: `https://pay.hostelhub.com/qr/${orderId}`,
      description: `Hostel Hub - Order #${orderId}`
    };
    setPaymentData(payment);
  };

  const copyPaymentInfo = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(paymentData, null, 2));
      setCopied(true);
      toast.success('Payment info copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy payment info');
    }
  };

  const simulatePayment = () => {
    setPaymentStatus('processing');
    toast.loading('Processing payment...', { id: 'payment' });
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      toast.success('Payment successful!', { id: 'payment' });
      setTimeout(() => {
        onPaymentSuccess({
          orderId,
          amount,
          paymentMethod: 'qr_code',
          transactionId: `TXN_${Date.now()}`,
          timestamp: new Date().toISOString()
        });
      }, 1000);
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (paymentStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-10 h-10 text-green-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-6">Your order has been confirmed and will be processed shortly.</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm">
            <span>Order ID:</span>
            <span className="font-mono">{orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Amount:</span>
            <span className="font-semibold">${amount}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Scan to Pay</h2>
        <p className="text-gray-600">Use your mobile payment app to scan the QR code</p>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
          timeLeft < 60 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
        }`}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Expires in {formatTime(timeLeft)}
        </div>
      </div>

      {/* QR Code */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 mb-6">
        <div className="flex justify-center">
          {paymentData && (
            <QRCode
              value={JSON.stringify(paymentData)}
              size={200}
              level="M"
              includeMargin={true}
            />
          )}
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Payment Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span className="font-mono">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-semibold text-lg">${amount}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span>QR Code</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={simulatePayment}
          disabled={paymentStatus === 'processing'}
          className="w-full btn btn-primary"
        >
          {paymentStatus === 'processing' ? (
            <>
              <div className="loading-spinner w-5 h-5" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Simulate Payment
            </>
          )}
        </button>

        <button
          onClick={copyPaymentInfo}
          className="w-full btn btn-outline"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy Payment Info
            </>
          )}
        </button>

        <button
          onClick={onPaymentCancel}
          className="w-full btn btn-outline text-gray-600 border-gray-300 hover:bg-gray-100"
        >
          Cancel Payment
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">How to pay:</h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Open your mobile payment app</li>
          <li>2. Scan the QR code above</li>
          <li>3. Confirm the payment amount</li>
          <li>4. Complete the payment</li>
        </ol>
      </div>
    </div>
  );
};

export default QRCodePayment;