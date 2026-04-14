import User from './models/User.js';
import connectDB from './config/database.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const testDatabase = async () => {
  try {
    console.log('🔍 Testing database connection...');
    await connectDB();
    
    console.log('🔧 Testing bcrypt import...');
    console.log('bcrypt type:', typeof bcrypt);
    console.log('bcrypt.compare type:', typeof bcrypt.compare);
    console.log('bcrypt.hash type:', typeof bcrypt.hash);
    
    if (typeof bcrypt.compare !== 'function') {
      console.error('❌ bcrypt.compare is not a function!');
      console.log('Available bcrypt methods:', Object.keys(bcrypt));
      process.exit(1);
    }
    
    console.log('✅ bcrypt import working correctly');
    
    console.log('📊 Checking existing users...');
    const users = await User.find({});
    console.log(`Found ${users.length} users in database`);
    
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - Approved: ${user.isApproved}`);
    });
    
    // Test admin user specifically
    console.log('\n🔍 Testing admin user...');
    const adminUser = await User.findOne({ email: 'admin@hostel.com' });
    
    if (adminUser) {
      console.log('✅ Admin user found:', {
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
        isApproved: adminUser.isApproved,
        hasPassword: !!adminUser.password,
        passwordLength: adminUser.password?.length
      });
      
      // Test password comparison
      console.log('\n🔐 Testing password comparison...');
      const testPassword = 'admin123';
      console.log('Test password:', testPassword);
      console.log('Stored hash:', adminUser.password);
      
      const isMatch = await bcrypt.compare(testPassword, adminUser.password);
      console.log('Direct bcrypt comparison result:', isMatch);
      
      // Also test the user method
      const isMatchMethod = await adminUser.comparePassword(testPassword);
      console.log('User method comparison result:', isMatchMethod);
      
      if (isMatch && isMatchMethod) {
        console.log('✅ Password verification working correctly!');
      } else {
        console.log('❌ Password verification failed!');
      }
      
    } else {
      console.log('❌ Admin user not found!');
    }
    
    console.log('\n✅ Database test completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
};

testDatabase();