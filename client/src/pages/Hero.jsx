import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/Layout/ThemeToggle';
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
  ChevronRight,
  Send
} from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const heroSlides = [
    {
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      title: 'Luxury Hostel Experience',
      subtitle: 'Premium rooms with world-class amenities and exceptional service'
    },
    {
      image: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg',
      title: 'Budget-Friendly Hostels',
      subtitle: 'Comfortable shared accommodations perfect for travelers'
    },
    {
      image: 'https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg',
      title: 'Modern Facilities',
      subtitle: 'Everything you need for a perfect and memorable stay'
    }
  ];

  const roomTypes = [
    {
      name: 'Luxury Suite',
      type: 'suite',
      price: 299,
      capacity: 4,
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      features: ['King Size Bed', 'Ocean View', 'Private Balcony', 'Mini Bar', 'Jacuzzi']
    },
    {
      name: 'Deluxe Room',
      type: 'double',
      price: 149,
      capacity: 2,
      image: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg',
      features: ['Queen Bed', 'City View', 'Work Desk', 'Free WiFi', 'Room Service']
    },
    {
      name: 'Standard Room',
      type: 'single',
      price: 89,
      capacity: 1,
      image: 'https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg',
      features: ['Single Bed', 'Compact Design', 'Essential Amenities', 'Free WiFi']
    },
    {
      name: 'Shared Hostel Room',
      type: 'shared',
      price: 29,
      capacity: 6,
      image: 'https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg',
      features: ['Bunk Beds', 'Shared Bathroom', 'Lockers', 'Common Area', 'Kitchen Access']
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

  React.useEffect(() => {
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

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle contact form submission
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for your inquiry! We will get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };

  const handleInputChange = (e) => {
    setContactForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen transition-colors duration-200 bg-white dark:bg-gray-900">
      {/* Public Navigation */}
      <nav className="sticky top-0 z-50 transition-colors duration-200 bg-white shadow-lg dark:bg-gray-800">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-600">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">HostelHub</span>
            </div>

            <div className="items-center hidden space-x-8 md:flex">
              <a href="#home" className="text-gray-600 transition-colors dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Home</a>
              <a href="#facilities" className="text-gray-600 transition-colors dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Facilities</a>
              <a href="#gallery" className="text-gray-600 transition-colors dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Gallery</a>
              <a href="#rooms" className="text-gray-600 transition-colors dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Rooms</a>
              <a href="#contact" className="text-gray-600 transition-colors dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle showLabel={false} size="sm" />
              <Link to="/login" className="text-gray-600 transition-colors dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
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
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
            <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl px-4"
              >
                <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
                  {slide.title}
                </h1>
                <p className="mb-8 text-xl md:text-2xl opacity-90">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <a href="#rooms" className="btn btn-primary btn-lg">
                    Explore Rooms
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                  <Link to="/login" className="text-white border-white btn btn-outline hover:bg-white hover:text-blue-600">
                    Login as Customer
                  </Link>
                  <Link to="/register" className="btn btn-secondary">
                    Register Now
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-8 left-1/2">
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
      <section className="py-20 transition-colors duration-200 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl dark:text-gray-200"
            >
              Welcome to HostelHub
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600 dark:text-gray-400"
            >
              Your premier destination for luxury accommodations and budget-friendly hostel stays. 
              Experience world-class hospitality with modern amenities, exceptional service, and 
              comfortable rooms designed for every traveler's needs and budget.
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full dark:bg-blue-900">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">1000+ Happy Guests</h3>
              <p className="text-gray-600 dark:text-gray-400">Join our community of satisfied travelers from around the world</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full dark:bg-teal-900">
                <Calendar className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">24/7 Availability</h3>
              <p className="text-gray-600 dark:text-gray-400">Round-the-clock service and support for all your needs</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full dark:bg-yellow-900">
                <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">5-Star Experience</h3>
              <p className="text-gray-600 dark:text-gray-400">Premium quality service and amenities for an unforgettable stay</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Room Types Section */}
      <section id="rooms" className="py-20 transition-colors duration-200 bg-gray-50 dark:bg-gray-800">
        <div className="container">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 text-4xl font-bold text-gray-800 dark:text-gray-200"
            >
              Our Accommodations
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400"
            >
              From luxury suites to budget-friendly shared rooms, we have the perfect accommodation for every traveler
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {roomTypes.map((room, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-0 overflow-hidden transition-shadow duration-300 card hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute px-3 py-1 rounded-lg top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-200">${room.price}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">/night</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">{room.name}</h3>
                  <div className="flex items-center mb-4 space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>Up to {room.capacity} guests</span>
                  </div>

                  <div className="mb-4 space-y-2">
                    {room.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
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
      <section id="facilities" className="py-20 transition-colors duration-200 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 text-4xl font-bold text-gray-800 dark:text-gray-200"
            >
              Premium Facilities
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400"
            >
              Enjoy our comprehensive range of facilities designed to make your stay comfortable and memorable
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center transition-shadow duration-300 card hover:shadow-lg"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full dark:bg-blue-900">
                  <facility.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">{facility.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{facility.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 transition-colors duration-200 bg-gray-50 dark:bg-gray-800">
        <div className="container">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 text-4xl font-bold text-gray-800 dark:text-gray-200"
            >
              Photo Gallery
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400"
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
            <div className="relative overflow-hidden h-96 rounded-xl">
              <img
                src={galleryImages[currentGalleryIndex]}
                alt={`Gallery ${currentGalleryIndex + 1}`}
                className="object-cover w-full h-full"
              />
              
              <button
                onClick={prevGalleryImage}
                className="absolute p-2 transition-colors transform -translate-y-1/2 rounded-full left-4 top-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </button>
              
              <button
                onClick={nextGalleryImage}
                className="absolute p-2 transition-colors transform -translate-y-1/2 rounded-full right-4 top-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700"
              >
                <ChevronRight className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </button>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGalleryIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentGalleryIndex ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 transition-colors duration-200 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 text-4xl font-bold text-gray-800 dark:text-gray-200"
            >
              Get in Touch
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400"
            >
              Ready to book your perfect stay? Contact us or create an account to get started
            </motion.p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="mb-8 text-2xl font-bold text-gray-800 dark:text-gray-200">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-900">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Address</h4>
                    <p className="text-gray-600 dark:text-gray-400">123 Hostel Street, City Center<br />Hyderabad, HY 500080</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg dark:bg-teal-900">
                    <Phone className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Phone</h4>
                    <p className="text-gray-600 dark:text-gray-400">+91 9010105008<br />24/7 Support Available</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg dark:bg-green-900">
                    <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Email</h4>
                    <p className="text-gray-600 dark:text-gray-400">info@hostelhub.com<br />reservations@hostelhub.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Quick Actions</h4>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link to="/register" className="btn btn-primary">
                    Create Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                  <Link to="/login" className="btn btn-outline">
                    Customer Login
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="card"
            >
              <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-200">Send us a Message</h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="input"
                    placeholder="Enter your full name"
                    value={contactForm.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="input"
                    placeholder="Enter your email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    required
                    className="input"
                    placeholder="Tell us how we can help you..."
                    value={contactForm.message}
                    onChange={handleInputChange}
                  />
                </div>

                <button type="submit" className="w-full btn btn-primary">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-white transition-colors duration-200 bg-gray-800 dark:bg-gray-900">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center mb-4 space-x-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-teal-600">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">HostelHub</span>
              </div>
              <p className="text-gray-400">
                Your premier destination for luxury accommodations and budget-friendly stays.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <div className="space-y-2">
                <a href="#home" className="block text-gray-400 transition-colors hover:text-white">Home</a>
                <a href="#rooms" className="block text-gray-400 transition-colors hover:text-white">Rooms</a>
                <a href="#facilities" className="block text-gray-400 transition-colors hover:text-white">Facilities</a>
                <a href="#gallery" className="block text-gray-400 transition-colors hover:text-white">Gallery</a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Services</h3>
              <div className="space-y-2">
                <span className="block text-gray-400">Room Service</span>
                <span className="block text-gray-400">Concierge</span>
                <span className="block text-gray-400">Laundry</span>
                <span className="block text-gray-400">Airport Transfer</span>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>1-1-652/2, BM Nagar</p>
                <p>Hyderabad, HY 500080</p>
                <p>Phone: +91 9010105008</p>
                <p>Email: venkysss47@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 text-center text-gray-400 border-t border-gray-700">
            <p>&copy; 2025 HostelHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;