import User from '../models/User.js';
import Room from '../models/Room.js';
import Food from '../models/Food.js';
import Booking from '../models/Booking.js';
import FoodOrder from '../models/FoodOrder.js';
import Complaint from '../models/Complaint.js';
import connectDB from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    console.log('Starting seed process...');
    await connectDB();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Room.deleteMany({});
    await Food.deleteMany({});
    await Booking.deleteMany({});
    await FoodOrder.deleteMany({});
    await Complaint.deleteMany({});
    
    console.log('Existing data cleared');

    // Create admin user
    console.log('Creating admin user...');
    const admin = new User({
      name: 'Admin User',
      email: 'admin@hostel.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890',
      address: 'Hostel Admin Office',
      isApproved: true
    });
    await admin.save();
    console.log('Admin user created:', admin.email);

    // Create staff user
    console.log('Creating staff user...');
    const staff = new User({
      name: 'Staff Member',
      email: 'staff@hostel.com',
      password: 'staff123',
      role: 'staff',
      phone: '+1234567891',
      address: 'Hostel Staff Quarters',
      isApproved: true
    });
    await staff.save();
    console.log('Staff user created:', staff.email);

    // Create customer user
    console.log('Creating customer user...');
    const customer = new User({
      name: 'John Customer',
      email: 'customer@hostel.com',
      password: 'customer123',
      role: 'customer',
      phone: '+1234567892',
      address: '123 Customer Street',
      isApproved: true
    });
    await customer.save();
    console.log('Customer user created:', customer.email);

    // Create additional customers for more realistic data
    const customer2 = new User({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'customer123',
      role: 'customer',
      phone: '+1234567893',
      address: '456 Customer Avenue',
      isApproved: true
    });
    await customer2.save();

    const customer3 = new User({
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: 'customer123',
      role: 'customer',
      phone: '+1234567894',
      address: '789 Customer Boulevard',
      isApproved: true
    });
    await customer3.save();

    console.log('All users created successfully');

    // Create sample rooms
    console.log('Creating sample rooms...');
    const rooms = [
      {
        name: 'Presidential Suite',
        type: 'suite',
        description: 'Luxurious presidential suite with panoramic city views, private balcony, and premium amenities',
        price: 499,
        capacity: 4,
        amenities: ['wifi', 'ac', 'tv', 'minibar', 'balcony', 'jacuzzi', 'butler_service'],
        images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'],
        floor: 10,
        roomNumber: '1001',
        status: 'available',
        rating: 4.9
      },
      {
        name: 'Luxury Suite',
        type: 'suite',
        description: 'Spacious luxury suite with ocean view and premium amenities',
        price: 299,
        capacity: 4,
        amenities: ['wifi', 'ac', 'tv', 'minibar', 'balcony'],
        images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'],
        floor: 5,
        roomNumber: '501',
        status: 'available',
        rating: 4.8
      },
      {
        name: 'Executive Suite',
        type: 'suite',
        description: 'Executive suite with separate living area and work space',
        price: 399,
        capacity: 3,
        amenities: ['wifi', 'ac', 'tv', 'minibar', 'work_desk', 'meeting_area'],
        images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'],
        floor: 8,
        roomNumber: '801',
        status: 'available',
        rating: 4.7
      },
      {
        name: 'Deluxe Double Room',
        type: 'double',
        description: 'Comfortable double room with modern amenities and city view',
        price: 149,
        capacity: 2,
        amenities: ['wifi', 'ac', 'tv', 'work_desk'],
        images: ['https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg'],
        floor: 3,
        roomNumber: '301',
        status: 'available',
        rating: 4.5
      },
      {
        name: 'Superior Double Room',
        type: 'double',
        description: 'Upgraded double room with premium furnishings',
        price: 179,
        capacity: 2,
        amenities: ['wifi', 'ac', 'tv', 'minibar', 'work_desk'],
        images: ['https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg'],
        floor: 4,
        roomNumber: '401',
        status: 'occupied',
        rating: 4.6
      },
      {
        name: 'Standard Single Room',
        type: 'single',
        description: 'Cozy single room perfect for solo travelers',
        price: 89,
        capacity: 1,
        amenities: ['wifi', 'ac', 'tv'],
        images: ['https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg'],
        floor: 2,
        roomNumber: '201',
        status: 'available',
        rating: 4.2
      },
      {
        name: 'Economy Single Room',
        type: 'single',
        description: 'Budget-friendly single room with essential amenities',
        price: 69,
        capacity: 1,
        amenities: ['wifi', 'ac'],
        images: ['https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg'],
        floor: 1,
        roomNumber: '101',
        status: 'cleaning',
        rating: 4.0
      },
      {
        name: 'Shared Hostel Room A',
        type: 'shared',
        description: 'Budget-friendly shared accommodation with bunk beds',
        price: 29,
        capacity: 6,
        amenities: ['wifi', 'lockers', 'shared_bathroom', 'common_area'],
        images: ['https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg'],
        floor: 1,
        roomNumber: '102',
        status: 'available',
        rating: 4.0
      },
      {
        name: 'Shared Hostel Room B',
        type: 'shared',
        description: 'Comfortable shared room with modern facilities',
        price: 35,
        capacity: 4,
        amenities: ['wifi', 'lockers', 'shared_bathroom', 'kitchen_access'],
        images: ['https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg'],
        floor: 1,
        roomNumber: '103',
        status: 'available',
        rating: 4.1
      },
      {
        name: 'Family Room',
        type: 'double',
        description: 'Spacious family room with extra beds for children',
        price: 199,
        capacity: 5,
        amenities: ['wifi', 'ac', 'tv', 'minibar', 'extra_beds'],
        images: ['https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg'],
        floor: 3,
        roomNumber: '302',
        status: 'maintenance',
        rating: 4.4
      }
    ];

    const savedRooms = await Room.insertMany(rooms);
    console.log('Rooms created successfully');

    // Create sample food items
    console.log('Creating sample food items...');
    const foods = [
      // Breakfast Items
      {
        name: 'Continental Breakfast',
        description: 'Fresh pastries, fruits, cereals, coffee, and juice',
        price: 15,
        category: 'breakfast',
        image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
        isAvailable: true,
        preparationTime: 10,
        ingredients: ['pastries', 'fruits', 'cereals', 'coffee', 'juice'],
        isVegetarian: true
      },
      {
        name: 'American Breakfast',
        description: 'Eggs, bacon, sausage, hash browns, toast, and coffee',
        price: 18,
        category: 'breakfast',
        image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
        isAvailable: true,
        preparationTime: 15,
        ingredients: ['eggs', 'bacon', 'sausage', 'hash_browns', 'toast'],
        isVegetarian: false
      },
      {
        name: 'Pancakes with Syrup',
        description: 'Fluffy pancakes served with maple syrup and butter',
        price: 12,
        category: 'breakfast',
        image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
        isAvailable: true,
        preparationTime: 15,
        ingredients: ['flour', 'eggs', 'milk', 'syrup', 'butter'],
        isVegetarian: true
      },
      {
        name: 'Avocado Toast',
        description: 'Toasted sourdough with smashed avocado, tomatoes, and herbs',
        price: 14,
        category: 'breakfast',
        image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
        isAvailable: true,
        preparationTime: 10,
        ingredients: ['sourdough', 'avocado', 'tomatoes', 'herbs'],
        isVegetarian: true
      },

      // Lunch Items
      {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with caesar dressing, croutons, and parmesan',
        price: 16,
        category: 'lunch',
        image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg',
        isAvailable: true,
        preparationTime: 10,
        ingredients: ['lettuce', 'dressing', 'croutons', 'parmesan'],
        isVegetarian: true
      },
      {
        name: 'Grilled Chicken Sandwich',
        description: 'Grilled chicken breast with lettuce, tomato, and mayo on brioche',
        price: 18,
        category: 'lunch',
        image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg',
        isAvailable: true,
        preparationTime: 20,
        ingredients: ['chicken', 'lettuce', 'tomato', 'mayo', 'brioche'],
        isVegetarian: false
      },
      {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 22,
        category: 'lunch',
        image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg',
        isAvailable: true,
        preparationTime: 25,
        ingredients: ['pizza_dough', 'tomato_sauce', 'mozzarella', 'basil'],
        isVegetarian: true
      },
      {
        name: 'Fish and Chips',
        description: 'Beer-battered fish with crispy fries and tartar sauce',
        price: 24,
        category: 'lunch',
        image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg',
        isAvailable: true,
        preparationTime: 30,
        ingredients: ['fish', 'batter', 'potatoes', 'tartar_sauce'],
        isVegetarian: false
      },

      // Dinner Items
      {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with lemon herb butter and vegetables',
        price: 32,
        category: 'dinner',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        isAvailable: true,
        preparationTime: 25,
        ingredients: ['salmon', 'lemon', 'herbs', 'butter', 'vegetables'],
        isVegetarian: false
      },
      {
        name: 'Ribeye Steak',
        description: 'Premium ribeye steak with garlic mashed potatoes and asparagus',
        price: 45,
        category: 'dinner',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        isAvailable: true,
        preparationTime: 30,
        ingredients: ['ribeye', 'potatoes', 'garlic', 'asparagus'],
        isVegetarian: false
      },
      {
        name: 'Vegetarian Pasta',
        description: 'Penne pasta with roasted vegetables in marinara sauce',
        price: 26,
        category: 'dinner',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        isAvailable: true,
        preparationTime: 20,
        ingredients: ['penne', 'vegetables', 'marinara', 'herbs'],
        isVegetarian: true
      },
      {
        name: 'Lobster Thermidor',
        description: 'Fresh lobster in creamy sauce with cheese and herbs',
        price: 55,
        category: 'dinner',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        isAvailable: true,
        preparationTime: 35,
        ingredients: ['lobster', 'cream', 'cheese', 'herbs'],
        isVegetarian: false
      },

      // Snacks
      {
        name: 'Chicken Wings',
        description: 'Spicy buffalo wings with blue cheese dip',
        price: 14,
        category: 'snacks',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        isAvailable: true,
        preparationTime: 20,
        ingredients: ['chicken_wings', 'buffalo_sauce', 'blue_cheese'],
        isVegetarian: false
      },
      {
        name: 'Nachos Supreme',
        description: 'Tortilla chips with cheese, jalapeños, and sour cream',
        price: 12,
        category: 'snacks',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        isAvailable: true,
        preparationTime: 15,
        ingredients: ['tortilla_chips', 'cheese', 'jalapeños', 'sour_cream'],
        isVegetarian: true
      },
      {
        name: 'Fruit Platter',
        description: 'Fresh seasonal fruits beautifully arranged',
        price: 10,
        category: 'snacks',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        isAvailable: true,
        preparationTime: 5,
        ingredients: ['seasonal_fruits'],
        isVegetarian: true
      },

      // Beverages
      {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        price: 6,
        category: 'beverages',
        image: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg',
        isAvailable: true,
        preparationTime: 5,
        ingredients: ['oranges'],
        isVegetarian: true
      },
      {
        name: 'Cappuccino',
        description: 'Rich espresso with steamed milk and foam',
        price: 5,
        category: 'beverages',
        image: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg',
        isAvailable: true,
        preparationTime: 5,
        ingredients: ['espresso', 'milk'],
        isVegetarian: true
      },
      {
        name: 'Craft Beer',
        description: 'Local craft beer selection',
        price: 8,
        category: 'beverages',
        image: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg',
        isAvailable: true,
        preparationTime: 2,
        ingredients: ['beer'],
        isVegetarian: true
      },
      {
        name: 'House Wine',
        description: 'Red or white wine from our selection',
        price: 12,
        category: 'beverages',
        image: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg',
        isAvailable: true,
        preparationTime: 2,
        ingredients: ['wine'],
        isVegetarian: true
      },
      {
        name: 'Smoothie Bowl',
        description: 'Acai smoothie bowl with granola and fresh fruits',
        price: 11,
        category: 'beverages',
        image: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg',
        isAvailable: true,
        preparationTime: 10,
        ingredients: ['acai', 'granola', 'fruits'],
        isVegetarian: true
      }
    ];

    const savedFoods = await Food.insertMany(foods);
    console.log('Food items created successfully');

    // Create sample bookings
    console.log('Creating sample bookings...');
    const bookings = [
      {
        customer: customer._id,
        room: savedRooms[0]._id, // Presidential Suite
        checkIn: new Date('2024-12-20'),
        checkOut: new Date('2024-12-23'),
        guests: 2,
        totalAmount: 1497, // 3 nights * 499
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        specialRequests: 'Late checkout requested',
        assignedStaff: staff._id
      },
      {
        customer: customer._id,
        room: savedRooms[1]._id, // Luxury Suite
        checkIn: new Date('2024-12-25'),
        checkOut: new Date('2024-12-28'),
        guests: 3,
        totalAmount: 897, // 3 nights * 299
        status: 'pending',
        paymentStatus: 'pending',
        specialRequests: 'Ocean view preferred'
      },
      {
        customer: customer._id,
        room: savedRooms[3]._id, // Deluxe Double Room
        checkIn: new Date('2024-12-15'),
        checkOut: new Date('2024-12-18'),
        guests: 2,
        totalAmount: 447, // 3 nights * 149
        status: 'checked-out',
        paymentStatus: 'paid',
        paymentMethod: 'cash'
      }
    ];

    await Booking.insertMany(bookings);
    console.log('Sample bookings created successfully');

    // Create sample food orders
    console.log('Creating sample food orders...');
    const foodOrders = [
      {
        customer: customer._id,
        items: [
          {
            food: savedFoods[0]._id, // Continental Breakfast
            quantity: 2,
            price: 30
          },
          {
            food: savedFoods[15]._id, // Fresh Orange Juice
            quantity: 2,
            price: 12
          }
        ],
        totalAmount: 42,
        status: 'delivered',
        deliveryLocation: 'Room 501',
        specialInstructions: 'No nuts please',
        assignedStaff: staff._id
      },
      {
        customer: customer._id,
        items: [
          {
            food: savedFoods[8]._id, // Grilled Salmon
            quantity: 1,
            price: 32
          },
          {
            food: savedFoods[17]._id, // House Wine
            quantity: 1,
            price: 12
          }
        ],
        totalAmount: 44,
        status: 'preparing',
        deliveryLocation: 'Room 1001',
        specialInstructions: 'Medium rare please'
      },
      {
        customer: customer._id,
        items: [
          {
            food: savedFoods[12]._id, // Chicken Wings
            quantity: 1,
            price: 14
          },
          {
            food: savedFoods[16]._id, // Craft Beer
            quantity: 2,
            price: 16
          }
        ],
        totalAmount: 30,
        status: 'ready',
        deliveryLocation: 'Lobby',
        assignedStaff: staff._id
      }
    ];

    await FoodOrder.insertMany(foodOrders);
    console.log('Sample food orders created successfully');

    // Create sample complaints
    console.log('Creating sample complaints...');
    const complaints = [
      {
        customer: customer._id,
        title: 'Room Air Conditioning Not Working',
        description: 'The air conditioning in room 501 is not working properly. It\'s making loud noises and not cooling the room effectively. This is affecting our sleep quality.',
        category: 'room',
        priority: 'high',
        status: 'pending'
      },
      {
        customer: customer2._id,
        title: 'Slow Room Service',
        description: 'I ordered room service 2 hours ago and it still hasn\'t arrived. The food is probably cold by now. This is very disappointing for a hostel of this caliber.',
        category: 'service',
        priority: 'medium',
        status: 'in-progress',
        response: 'We sincerely apologize for the delay. Our kitchen was experiencing high volume tonight. We are preparing a fresh order for you right now and it will be delivered within 15 minutes. We will also provide a complimentary dessert for the inconvenience.',
        respondedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        customer: customer3._id,
        title: 'Noisy Neighbors',
        description: 'The guests in the room next to mine (Room 302) are being extremely loud late at night. They are playing music and talking loudly until 2 AM. I have an early meeting tomorrow.',
        category: 'general',
        priority: 'medium',
        status: 'resolved',
        response: 'Thank you for bringing this to our attention. We have spoken with the guests in Room 302 and reminded them of our quiet hours policy (10 PM - 7 AM). We have also moved you to a quieter room on a different floor as a courtesy. We apologize for any inconvenience caused.',
        respondedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        customer: customer._id,
        title: 'Billing Error',
        description: 'I was charged twice for the same room service order on my bill. The charge appears twice - once for $42 and again for $42. Please correct this error.',
        category: 'billing',
        priority: 'high',
        status: 'pending'
      },
      {
        customer: customer2._id,
        title: 'Pool Area Cleanliness',
        description: 'The pool area was not clean when I visited this morning. There were leaves floating in the water and the deck chairs were dirty. The pool should be maintained better.',
        category: 'facilities',
        priority: 'low',
        status: 'in-progress',
        response: 'Thank you for your feedback. Our maintenance team has been notified and they are currently cleaning the pool area. We perform regular cleaning, but sometimes weather conditions require additional attention. The area should be spotless within the hour.',
        respondedAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      },
      {
        customer: customer3._id,
        title: 'WiFi Connection Issues',
        description: 'The WiFi in my room keeps disconnecting every few minutes. I need a stable internet connection for work. I\'ve tried restarting my devices but the problem persists.',
        category: 'facilities',
        priority: 'medium',
        status: 'pending'
      },
      {
        customer: customer._id,
        title: 'Food Quality Issue',
        description: 'The steak I ordered from room service was overcooked and cold when it arrived. I ordered medium-rare but received well-done. For the price paid, I expected much better quality.',
        category: 'food',
        priority: 'medium',
        status: 'resolved',
        response: 'We sincerely apologize for the poor quality of your meal. This does not meet our standards. We have refunded the full amount for your steak dinner and would like to invite you to try our restaurant again with a complimentary meal of your choice. Our head chef has been informed to ensure this doesn\'t happen again.',
        respondedAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      {
        customer: customer2._id,
        title: 'Rude Staff Behavior',
        description: 'The front desk staff member was very rude when I asked about late checkout options. They were dismissive and unprofessional. This kind of behavior is unacceptable.',
        category: 'staff',
        priority: 'high',
        status: 'in-progress',
        response: 'We are very sorry to hear about this experience. This behavior is not acceptable and does not reflect our values. We are investigating this matter and will take appropriate action. We would like to speak with you personally to make this right.',
        respondedAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      }
    ];

    await Complaint.insertMany(complaints);
    console.log('Sample complaints created successfully');

    console.log('\n=== SEED DATA CREATED SUCCESSFULLY! ===');
    console.log('\n🔐 Demo accounts created:');
    console.log('👑 Admin: admin@hostel.com / admin123');
    console.log('👨‍🔧 Staff: staff@hostel.com / staff123');
    console.log('👤 Customer: customer@hostel.com / customer123');
    console.log('👤 Customer 2: jane@example.com / customer123');
    console.log('👤 Customer 3: mike@example.com / customer123');
    console.log('\n🏨 Sample data created:');
    console.log(`📊 ${rooms.length} rooms with various types and statuses`);
    console.log(`🍽️ ${foods.length} food items across all categories`);
    console.log(`📅 ${bookings.length} sample bookings with different statuses`);
    console.log(`🛎️ ${foodOrders.length} sample food orders`);
    console.log(`📝 ${complaints.length} sample complaints with different statuses`);
    console.log('\n✅ Database is ready for testing with full CRUD operations!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run if called directly
if (process.argv[1].includes('seedData.js')) {
  seedData();
}

export default seedData;