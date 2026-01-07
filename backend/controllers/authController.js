import User from '../models/User.js';
import BusinessUser from '../models/BusinessUser.js';
import NormalUser from '../models/NormalUser.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, userType } = req.body;

    // Validation
    if (!name || !email || !phone || !password || !userType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    let user;

    // Create Business User
    if (userType === 'business') {
      const { businessProfile } = req.body;

      if (!businessProfile) {
        return res.status(400).json({
          success: false,
          message: 'Business profile information is required',
        });
      }

      user = await BusinessUser.create({
        name,
        email,
        phone,
        password,
        userType,
        businessProfile,
      });
    }
    // Create Normal User
    else if (userType === 'normal') {
      const { location, interests } = req.body;

      user = await NormalUser.create({
        name,
        email,
        phone,
        password,
        userType,
        location: location || '',
        interests: interests || [],
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering user',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging in',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update basic fields
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    // Update business profile if business user
    if (user.userType === 'business' && req.body.businessProfile) {
      const businessUser = await BusinessUser.findById(req.user._id);
      businessUser.businessProfile = {
        ...businessUser.businessProfile,
        ...req.body.businessProfile,
      };
      await businessUser.save();
    }

    // Update normal user fields
    if (user.userType === 'normal') {
      const normalUser = await NormalUser.findById(req.user._id);
      if (req.body.location) normalUser.location = req.body.location;
      if (req.body.interests) normalUser.interests = req.body.interests;
      await normalUser.save();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error changing password',
    });
  }
};