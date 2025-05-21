const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register new user
router.post('/', async (req, res) => {
  console.log('=== New Registration Request ===');
  console.log('Body:', { ...req.body, password: '[HIDDEN]' });
  
  try {
    const {
      full_name,
      email,
      password,
      phone_number,
      masked_aadhaar,
      pan_number
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        { phone_number },
        { masked_aadhaar },
        { pan_number: pan_number.toUpperCase() }
      ]
    });

    if (existingUser) {
      let field = 'account';
      if (existingUser.email === email) field = 'email';
      if (existingUser.phone_number === phone_number) field = 'phone number';
      if (existingUser.masked_aadhaar === masked_aadhaar) field = 'Aadhaar number';
      if (existingUser.pan_number === pan_number.toUpperCase()) field = 'PAN number';
      
      console.log(`Registration failed: ${field} already exists`);
      return res.status(400).json({
        success: false,
        error: `This ${field} is already registered`
      });
    }

    // Create new user
    const user = new User({
      full_name,
      email,
      password,
      phone_number,
      masked_aadhaar,
      pan_number: pan_number.toUpperCase(),
      account_status: 'pending',
      kyc_status: 'pending',
      wallet_balance: 0
    });

    console.log('Creating new user:', {
      full_name,
      email,
      phone_number,
      masked_aadhaar,
      pan_number: pan_number.toUpperCase()
    });

    await user.save();
    console.log('User saved successfully with ID:', user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please login to continue.',
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Stack trace:', error.stack);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  console.log('=== Login Request ===');
  console.log('Body:', { ...req.body, password: '[HIDDEN]' });

  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, is_deleted: false });
    console.log('User lookup result:', email, user ? 'Found' : 'Not found');

    if (!user) {
      console.log('Login failed: User not found -', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check account status
    if (user.account_status === 'suspended' || user.account_status === 'blocked') {
      console.log('Login failed: Account', user.account_status);
      return res.status(403).json({
        success: false,
        error: `Your account is ${user.account_status}. Please contact support.`
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password check result:', isMatch ? 'Match' : 'No match');

    if (!isMatch) {
      // Increment login attempts
      await user.incrementLoginAttempts();
      console.log('Login failed: Invalid password for user -', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Update login info
    await user.updateLoginInfo();
    console.log('Login successful for:', email);

    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        account_status: user.account_status,
        kyc_status: user.kyc_status,
        wallet_balance: user.wallet_balance
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.'
    });
  }
});

module.exports = router; 