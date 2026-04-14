import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  Car, 
  Coffee, 
  Utensils, 
  Dumbbell, 
  Waves,
  Shield,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const Facilities = () => {
  const facilities = [
    {
      icon: Wifi,
      title: 'Free High-Speed WiFi',
      description: 'Complimentary high-speed internet access throughout the property',
      image: 'https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg'
    },
    {
      icon: Car,
      title: 'Free Parking',
      description: 'Secure parking spaces available for all guests at no extra charge',
      image: 'https://images.pexels.com/photos/63294/autos-technology-vw-multi-storey-car-park-63294.jpeg'
    },
    {
      icon: Coffee,
      title: 'Coffee Lounge',
      description: '24/7 coffee and tea service with comfortable seating area',
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg'
    },
    {
      icon: Utensils,
      title: 'Restaurant & Room Service',
      description: 'Fine dining restaurant with extensive menu and 24/7 room service',
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg'
    },
    {
      icon: Dumbbell,
      title: 'Fitness Center',
      description: 'Fully equipped gym with modern exercise equipment',
      image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg'
    },
    {
      icon: Waves,
      title: 'Swimming Pool',
      description: 'Indoor heated pool and outdoor pool with sun deck',
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg'
    },
    {
      icon: Shield,
      title: '24/7 Security',
      description: 'Round-the-clock security service and CCTV monitoring',
      image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg'
    },
    {
      icon: Users,
      title: 'Conference Rooms',
      description: 'Modern meeting rooms with AV equipment for business travelers',
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg'
    }
  ];

  const services = [
    {
      icon: Clock,
      title: '24/7 Front Desk',
      description: 'Our friendly staff is available around the clock to assist you'
    },
    {
      icon: Phone,
      title: 'Concierge Service',
      description: 'Local recommendations and booking assistance for attractions'
    },
    {
      icon: Mail,
      title: 'Laundry Service',
      description: 'Professional laundry and dry cleaning services available'
    },
    {
      icon: MapPin,
      title: 'Tour Assistance',
      description: 'Help with local tours, transportation, and sightseeing'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Our Facilities & Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Experience comfort and convenience with our comprehensive range of facilities 
            designed to make your stay memorable and enjoyable.
          </motion.p>
        </div>

        {/* Main Facilities */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-800 text-center mb-12"
          >
            Premium Facilities
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-xl transition-shadow duration-300 overflow-hidden p-0"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <facility.icon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {facility.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {facility.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Additional Services */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-800 text-center mb-12"
          >
            Additional Services
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Facility Hours */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="card bg-gradient-to-r from-blue-600 to-teal-600 text-white"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Facility Hours</h2>
              <p className="text-blue-100">
                Most of our facilities are available 24/7 for your convenience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Swimming Pool</h3>
                <p className="text-blue-100">6:00 AM - 10:00 PM</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Fitness Center</h3>
                <p className="text-blue-100">24/7 Access</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Restaurant</h3>
                <p className="text-blue-100">6:00 AM - 11:00 PM</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Coffee Lounge</h3>
                <p className="text-blue-100">24/7 Service</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Front Desk</h3>
                <p className="text-blue-100">24/7 Available</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Conference Rooms</h3>
                <p className="text-blue-100">By Reservation</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Contact Information */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Need More Information?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our staff is here to help you make the most of your stay
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+1234567890" className="btn btn-primary">
                <Phone className="w-5 h-5 mr-2" />
                Call Front Desk
              </a>
              <a href="mailto:info@hostelhub.com" className="btn btn-outline">
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Facilities;