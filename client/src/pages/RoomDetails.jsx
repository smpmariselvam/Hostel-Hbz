import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Star, 
  Users, 
  MapPin, 
  Wifi, 
  Car, 
  Coffee,
  Calendar,
  DollarSign,
  Heart,
  Share2
} from 'lucide-react';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, hasRole } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`/api/rooms/${id}`);
      setRoom(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching room details:', error);
      toast.error('Failed to load room details');
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated()) {
      toast.info('Please login to book a room');
      navigate('/login');
      return;
    }

    if (!hasRole('customer')) {
      toast.error('Only customers can book rooms');
      return;
    }

    navigate(`/book/${id}`);
  };

  const getRoomTypeLabel = (type) => {
    const labels = {
      single: 'Single Room',
      double: 'Double Room',
      suite: 'Suite',
      shared: 'Shared Room',
      hostel: 'Hostel Bed'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'text-green-600 bg-green-100',
      occupied: 'text-red-600 bg-red-100',
      cleaning: 'text-yellow-600 bg-yellow-100',
      maintenance: 'text-orange-600 bg-orange-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
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
          <Link to="/rooms" className="btn btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  const images = room.images && room.images.length > 0 
    ? room.images 
    : ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'];

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to="/rooms" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Rooms
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="relative h-96 rounded-xl overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${room.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Room Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{room.name}</h1>
                  <p className="text-lg text-gray-600">{getRoomTypeLabel(room.type)}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">${room.price}</div>
                  <div className="text-gray-600">per night</div>
                </div>
              </div>

              {room.rating > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(room.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {room.rating.toFixed(1)} ({room.reviews?.length || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{room.description}</p>
            </div>

            {/* Room Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{room.capacity} guests</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Floor {room.floor}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Room {room.roomNumber}</span>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">${room.price}/night</span>
              </div>
            </div>

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {amenity === 'wifi' && <Wifi className="w-4 h-4 text-gray-400" />}
                      {amenity === 'parking' && <Car className="w-4 h-4 text-gray-400" />}
                      {amenity === 'breakfast' && <Coffee className="w-4 h-4 text-gray-400" />}
                      <span className="text-gray-700 capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleBookNow}
                disabled={room.status !== 'available'}
                className={`w-full btn ${
                  room.status === 'available' ? 'btn-primary' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {room.status === 'available' ? 'Book Now' : `Room ${room.status}`}
              </button>
              <p className="text-sm text-gray-600 text-center mt-2">
                Free cancellation • No booking fees
              </p>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {room.reviews && room.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Guest Reviews</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {room.reviews.slice(0, 6).map((review, index) => (
                <div key={index} className="card">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {review.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-800">
                          {review.user?.name || 'Anonymous'}
                        </span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;