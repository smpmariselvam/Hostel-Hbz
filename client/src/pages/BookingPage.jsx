import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  MapPin,
  ArrowLeft,
  Check
} from 'lucide-react';

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: ''
  });

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`/api/rooms/${roomId}`);
      setRoom(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching room details:', error);
      toast.error('Failed to load room details');
      navigate('/rooms');
    }
  };

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotal = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !room) return 0;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights * room.price : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    
    if (checkIn >= checkOut) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    if (checkIn < new Date()) {
      toast.error('Check-in date cannot be in the past');
      return;
    }

    if (bookingData.guests > room.capacity) {
      toast.error(`Maximum ${room.capacity} guests allowed for this room`);
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post('/api/bookings', {
        roomId,
        ...bookingData
      });

      toast.success('Booking created successfully!');
      navigate('/customer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Room Not Found</h2>
          <button onClick={() => navigate('/rooms')} className="btn btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  const total = calculateTotal();
  const nights = bookingData.checkIn && bookingData.checkOut 
    ? Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button 
            onClick={() => navigate(`/rooms/${roomId}`)}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Room Details
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Room Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Room Summary</h2>
              
              <div className="flex items-start space-x-4 mb-6">
                <img
                  src={room.images?.[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
                  alt={room.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{room.name}</h3>
                  <p className="text-gray-600">{room.type} • Room {room.roomNumber}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">${room.price}/night</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Up to {room.capacity} guests</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Floor {room.floor}</span>
                </div>
              </div>

              {room.amenities && room.amenities.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Summary */}
            {total > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card bg-blue-50 border-blue-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Room Rate</span>
                    <span>${room.price}/night</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Nights</span>
                    <span>{nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests</span>
                    <span>{bookingData.guests}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Stay</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="checkIn"
                        required
                        className="input pl-12"
                        value={bookingData.checkIn}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="checkOut"
                        required
                        className="input pl-12"
                        value={bookingData.checkOut}
                        onChange={handleInputChange}
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="guests"
                      className="input pl-12"
                      value={bookingData.guests}
                      onChange={handleInputChange}
                    >
                      {[...Array(room.capacity)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Guest{i > 0 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="specialRequests"
                    rows="3"
                    className="input"
                    placeholder="Any special requests or requirements..."
                    value={bookingData.specialRequests}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Guest Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3">Guest Information</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Name:</span> {user?.name}</p>
                    <p><span className="font-medium">Email:</span> {user?.email}</p>
                    <p><span className="font-medium">Phone:</span> {user?.phone}</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || total === 0}
                  className="w-full btn btn-primary"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Confirm Booking
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By booking, you agree to our terms and conditions. 
                  Free cancellation up to 24 hours before check-in.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;