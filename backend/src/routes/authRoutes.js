const express = require('express');
const {
  authUser,
  registerUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../utils/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
