const jwt = require('jsonwebtoken');
const User = require('../models/User');

// In-memory mock database for users since MongoDB isn't running locally
const mockUsers = [];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!process.env.MONGO_URI) {
      const userExists = mockUsers.find(u => u.email === email);
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const newUser = {
        _id: Date.now().toString(),
        name,
        email,
        password // storing raw password just for mock purposes
      };
      
      mockUsers.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(newUser._id),
      });
    }

    // Production Mongoose Database mode
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!process.env.MONGO_URI) {
      const user = mockUsers.find(u => u.email === email);
      // Simple raw password check for the mock
      if (user && user.password === password) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Production Mongoose Database mode
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!process.env.MONGO_URI) {
      const user = mockUsers.find(u => u._id === userId);
      if (user) {
        const { password, ...safeUser } = user;
        return res.json(safeUser);
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    }

    // Production Mongoose Database mode
    const user = await User.findById(userId).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
