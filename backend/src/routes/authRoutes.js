const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check password length
    if (password.length < 8) {
      return res.status(400).send('Password must be at least 8 characters long.');
    }

    // Create a new user
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      const field = error.keyPattern.username ? 'username' : 'email';
      return res.status(400).send(`${field.charAt(0).toUpperCase() + field.slice(1)} already in use.`);
    }
    res.status(500).send('Internal server error');
  }
});


// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
