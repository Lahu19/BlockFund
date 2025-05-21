const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Fields from registration form
  full_name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone_number: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  masked_aadhaar: {
    type: String,
    required: [true, 'Aadhaar number is required'],
    trim: true,
    match: [/^\d{12}$/, 'Please enter a valid 12-digit Aadhaar number']
  },
  pan_number: {
    type: String,
    required: [true, 'PAN number is required'],
    trim: true,
    uppercase: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
  },

  // Additional fields (auto-generated)
  user_role: {
    type: String,
    enum: ['user', 'admin', 'verifier'],
    default: 'user'
  },
  account_status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'blocked'],
    default: 'pending'
  },
  kyc_status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  wallet_balance: {
    type: Number,
    default: 0,
    min: 0
  },
  last_login: {
    type: Date
  },
  login_attempts: {
    type: Number,
    default: 0
  },
  verification_token: String,
  reset_password_token: String,
  reset_password_expires: Date,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.updated_at = Date.now();
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp on modification
userSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to update login info
userSchema.methods.updateLoginInfo = async function() {
  this.last_login = Date.now();
  this.login_attempts = 0;
  await this.save();
};

// Method to increment login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  this.login_attempts += 1;
  if (this.login_attempts >= 5) {
    this.account_status = 'suspended';
  }
  await this.save();
};

// Add indexes
userSchema.index({ email: 1 });
userSchema.index({ phone_number: 1 });
userSchema.index({ pan_number: 1 });
userSchema.index({ masked_aadhaar: 1 });
userSchema.index({ account_status: 1 });
userSchema.index({ kyc_status: 1 });
userSchema.index({ user_role: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User; 