import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'customer'],
    default: 'customer'
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  isApproved: {
    type: Boolean,
    default: function() {
      return this.role === 'customer' || this.role === 'admin';
    }
  },
  profileImage: {
    type: String
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    console.log('Hashing password for user:', this.email);
    console.log('bcrypt available:', typeof bcrypt);
    console.log('bcrypt.hash available:', typeof bcrypt.hash);
    
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully for:', this.email);
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('Comparing password for user:', this.email);
    console.log('Candidate password length:', candidatePassword?.length);
    console.log('Stored hash length:', this.password?.length);
    console.log('bcrypt available in method:', typeof bcrypt);
    console.log('bcrypt.compare available in method:', typeof bcrypt.compare);
    
    if (!candidatePassword || !this.password) {
      console.log('Missing password or hash');
      return false;
    }
    
    if (typeof bcrypt.compare !== 'function') {
      console.error('bcrypt.compare is not a function in user method!');
      console.log('Available bcrypt methods:', Object.keys(bcrypt));
      return false;
    }
    
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result for', this.email, ':', result);
    return result;
  } catch (error) {
    console.error('Error comparing password for', this.email, ':', error);
    return false;
  }
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model('User', userSchema);