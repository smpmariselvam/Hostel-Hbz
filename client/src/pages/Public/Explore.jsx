import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Calendar, 
  Shield,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Dumbbell,
  Waves,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Explore = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  // Redirect authenticated users to their dashboards
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const heroSlides = [
    {
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      title: 'Luxury Hostel Experience',
      subtitle: 'Premium rooms with world-class amenities'
    },
    {
      image: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg',
      title: 'Budget-Friendly Hostels',
      subtitle: 'Comfortable shared accommodations for travelers'
    },
    {
      image: 'https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg',
      title: 'Modern Facilities',
      subtitle: 'Everything you need for a perfect stay'
    }
  ];

  const roomTypes = [
    {
      name: 'Luxury Suite',
      type: 'suite',
      price: 299,
      capacity: 4,
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      features: ['King Size Bed', 'Ocean View', 'Private Balcony', 'Mini Bar']
    },
    {
      name: 'Deluxe Room',
      type: 'double',
      price: 149,
      capacity: 2,
      image: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg',
      features: ['Queen Bed', 'City View', 'Work Desk', 'Free WiFi']
    },
    {
      name: 'Standard Room',
      type: 'single',
      price: 89,
      capacity: 1,
      image: 'https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg',
      features: ['Single Bed', 'Compact Design', 'Essential Amenities']
    },
    {
      name: 'Shared Hostel Room',
      type: 'shared',
      price: 29,
      capacity: 6,
      image: 'https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg',
      features: ['Bunk Beds', 'Shared Bathroom', 'Lockers', 'Common Area']
    }
  ];

  const facilities = [
    { icon: Wifi, title: 'Free High-Speed WiFi', description: 'Complimentary internet throughout the property' },
    { icon: Car, title: 'Free Parking', description: 'Secure parking spaces for all guests' },
    { icon: Coffee, title: '24/7 Coffee Lounge', description: 'Fresh coffee and snacks available anytime' },
    { icon: Utensils, title: 'Restaurant & Room Service', description: 'Fine dining and 24/7 room service' },
    { icon: Dumbbell, title: 'Fitness Center', description: 'Modern gym equipment and facilities' },
    { icon: Waves, title: 'Swimming Pool', description: 'Indoor heated pool and outdoor deck' },
    { icon: Shield, title: '24/7 Security', description: 'Round-the-clock security and CCTV monitoring' },
    { icon: Users, title: 'Conference Rooms', description: 'Meeting rooms with modern AV equipment' }
  ];

  const galleryImages = [
    'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
    'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg',
    'https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg',
    'https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg',
    'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg',
    'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextGalleryImage = () => {
    setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevGalleryImage = () => {
    setCurrentGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="min-h-screen">
      {/* Public Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container">
          <div className="flex justify-between items-center py-4">
            <Link to="/explore" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">HostelHub</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="#facilities" className="text-gray-600 hover:text-blue-600 transition-colors">Facilities</a>
              <a href="#gallery" className="text-gray-600 hover:text-blue-600 transition-colors">Gallery</a>
              <a href="#rooms" className="text-gray-600 hover:text-blue-600 transition-colors">Rooms</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login-customer" className="text-gray-600 hover:text-blue-600 transition-colors">
                Customer Login
              </Link>
              <Link to="/login-staff" className="text-gray-600 hover:text-blue-600 transition-colors">
                Staff Login
              </Link>
              <Link to="/login-admin" className="btn btn-primary">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
            <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl px-4"
              >
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Book Your Stay
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <a href="#rooms" className="btn btn-outline text-white border-white hover:bg-white hover:text-blue-600">
                    Explore Rooms
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            >
              Welcome to HostelHub
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Your premier destination for luxury accommodations and budget-friendly hostel stays. 
              Experience world-class hospitality with modern amenities, exceptional service, and 
              comfortable rooms designed for every traveler.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">500+ Happy Guests</h3>
              <p className="text-gray-600">Join our community of satisfied travelers from around the world</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">24/7 Availability</h3>
              <p className="text-gray-600">Round-the-clock service and support for all your needs</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">5-Star Experience</h3>
              <p className="text-gray-600">Premium quality service and amenities for an unforgettable stay</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Room Types Section */}
      <section id="rooms" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-800 mb-6"
            >
              Our Accommodations
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              From luxury suites to budget-friendly shared rooms, we have the perfect accommodation for every traveler
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roomTypes.map((room, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card hover:shadow-xl transition-shadow duration-300 overflow-hidden p-0"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-lg font-bold text-gray-800">${room.price}</span>
                    <span className="text-sm text-gray-600">/night</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{room.name}</h3>
                  <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Up to {room.capacity} guests</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {room.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/register" className="w-full btn btn-primary">
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-800 mb-6"
            >
              Premium Facilities
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Enjoy our comprehensive range of facilities designed to make your stay comfortable and memorable
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <facility.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{facility.title}</h3>
                <p className="text-gray-600 text-sm">{facility.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-800 mb-6"
            >
              Photo Gallery
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Take a visual tour of our beautiful property and facilities
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative h-96 rounded-xl overflow-hidden">
              <img
                src={galleryImages[currentGalleryIndex]}
                alt={`Gallery ${currentGalleryIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              <button
                onClick={prevGalleryImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              
              <button
                onClick={nextGalleryImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGalleryIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentGalleryIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-800 mb-6"
            >
              Get in Touch
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Ready to book your perfect stay? Contact us or create an account to get started
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Address</h3>
              <p className="text-gray-600">123 Hostel Street, City Center<br />New York, NY 10001</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567<br />24/7 Support Available</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600">info@hostelhub.com<br />reservations@hostelhub.com</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/login-customer" className="btn btn-outline btn-lg">
                Customer Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">HostelHub</span>
              </div>
              <p className="text-gray-400">
                Your premier destination for luxury accommodations and budget-friendly stays.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#home" className="block text-gray-400 hover:text-white transition-colors">Home</a>
                <a href="#rooms" className="block text-gray-400 hover:text-white transition-colors">Rooms</a>
                <a href="#facilities" className="block text-gray-400 hover:text-white transition-colors">Facilities</a>
                <a href="#gallery" className="block text-gray-400 hover:text-white transition-colors">Gallery</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <div className="space-y-2">
                <span className="block text-gray-400">Room Service</span>
                <span className="block text-gray-400">Concierge</span>
                <span className="block text-gray-400">Laundry</span>
                <span className="block text-gray-400">Airport Transfer</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>123 Hostel Street, City Center</p>
                <p>New York, NY 10001</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Email: info@hostelhub.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HostelHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Explore;