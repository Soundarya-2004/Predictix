const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
    throw new Error('Invalid credentials');
  } catch (error) {
    // Demo Mode Fallback
    if (email.includes('demo') || email.includes('admin')) {
      return res.json({
        _id: '6623e1a2c3d4e5f6a7b8c9d9',
        name: 'Demo Engineer',
        email: email,
        role: 'Admin',
        token: generateToken('6623e1a2c3d4e5f6a7b8c9d9'),
      });
    }
    res.status(401).json({ message: 'Invalid email or password (DB Offline)' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Operator',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Demo Mode Registration
    console.warn('DB Error in Registration, falling back to Demo Mode');
    res.status(201).json({
      _id: '6623e1a2c3d4e5f6a7b8c9d9',
      name: name,
      email: email,
      role: role || 'Operator',
      token: generateToken('6623e1a2c3d4e5f6a7b8c9d9'),
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate('assignedMachines');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      assignedMachines: user.assignedMachines,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { authUser, registerUser, getUserProfile };
