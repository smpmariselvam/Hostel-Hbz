import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Wifi, 
  Car, 
  Coffee,
  ArrowRight,
  MapPin
} from 'lucide-react';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    capacity: '',
    search: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rooms, filters]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/rooms');
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...rooms];

    if (filters.type) {
      filtered = filtered.filter(room => room.type === filters.type);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(room => room.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(room => room.price <= Number(filters.maxPrice));
    }

    if (filters.capacity) {
      filtered = filtered.filter(room => room.capacity >= Number(filters.capacity));
    }

    if (filters.search) {
      filtered = filtered.filter(room =>
        room.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        room.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredRooms(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      capacity: '',
      search: ''
    });
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

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Our Rooms & Accommodations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            From luxury suites to budget-friendly shared rooms, find the perfect accommodation for your stay
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Filter Rooms</h3>
            <button
              onClick={clearFilters}
              className="ml-auto text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                className="input pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <select
              className="input"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="single">Single Room</option>
              <option value="double">Double Room</option>
              <option value="suite">Suite</option>
              <option value="shared">Shared Room</option>
              <option value="hostel">Hostel Bed</option>
            </select>

            <input
              type="number"
              placeholder="Min Price"
              className="input"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />

            <input
              type="number"
              placeholder="Max Price"
              className="input"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />

            <select
              className="input"
              value={filters.capacity}
              onChange={(e) => handleFilterChange('capacity', e.target.value)}
            >
              <option value="">Any Capacity</option>
              <option value="1">1 Person</option>
              <option value="2">2+ People</option>
              <option value="4">4+ People</option>
              <option value="6">6+ People</option>
            </select>

            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-600">
                {filteredRooms.length} rooms found
              </span>
            </div>
          </div>
        </motion.div>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-xl transition-shadow duration-300 overflow-hidden p-0"
            >
              {/* Room Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={room.images?.[0] || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                    {room.status}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-lg font-bold text-gray-800">${room.price}</span>
                  <span className="text-sm text-gray-600">/night</span>
                </div>
              </div>

              {/* Room Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{room.name}</h3>
                    <p className="text-sm text-gray-600">{getRoomTypeLabel(room.type)}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{room.rating || 4.5}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>

                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{room.capacity} guests</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Floor {room.floor}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex items-center space-x-3 mb-6">
                  {room.amenities?.includes('wifi') && <Wifi className="w-4 h-4 text-gray-400" />}
                  {room.amenities?.includes('parking') && <Car className="w-4 h-4 text-gray-400" />}
                  {room.amenities?.includes('breakfast') && <Coffee className="w-4 h-4 text-gray-400" />}
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Link
                    to={`/rooms/${room._id}`}
                    className="flex-1 btn btn-outline text-center"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/book/${room._id}`}
                    className="flex-1 btn btn-primary text-center"
                    disabled={room.status !== 'available'}
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No rooms found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Rooms;