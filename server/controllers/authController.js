const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (global.dbMode === 'mock') {
      const lowerEmail = email.toLowerCase();
      let user = global.mockDB.users.find(u => u.email.toLowerCase() === lowerEmail);
      if (user) {
        return res.status(400).json({ detail: 'A user with this email address already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'mock_user_' + Date.now(),
        email: lowerEmail,
        name,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date()
      };
      global.mockDB.users.push(newUser);

      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email },
        process.env.SECRET_KEY || 'resumeforge_super_secret_jwt_key_1234567890',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        access_token: token,
        token_type: 'bearer',
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          createdAt: newUser.createdAt
        }
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ detail: 'A user with this email address already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      name,
      password: hashedPassword
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY || 'resumeforge_super_secret_jwt_key_1234567890',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Support OAuth2 form-urlencoded (username) and JSON logins (email)
    const loginEmail = username || email;
    if (!loginEmail || !password) {
      return res.status(400).json({ detail: 'Email and password are required' });
    }

    if (global.dbMode === 'mock') {
      const lowerEmail = loginEmail.toLowerCase();
      const user = global.mockDB.users.find(u => u.email.toLowerCase() === lowerEmail);
      if (!user) {
        return res.status(401).json({ detail: 'Incorrect email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ detail: 'Incorrect email or password' });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.SECRET_KEY || 'resumeforge_super_secret_jwt_key_1234567890',
        { expiresIn: '7d' }
      );

      return res.json({
        access_token: token,
        token_type: 'bearer',
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt
        }
      });
    }

    const user = await User.findOne({ email: loginEmail });
    if (!user) {
      return res.status(401).json({ detail: 'Incorrect email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ detail: 'Incorrect email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY || 'resumeforge_super_secret_jwt_key_1234567890',
      { expiresIn: '7d' }
    );

    res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    if (global.dbMode === 'mock') {
      const user = global.mockDB.users.find(u => u._id === req.user.id);
      if (!user) {
        return res.status(404).json({ detail: 'User not found' });
      }
      return res.json({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ detail: 'User not found' });
    }
    
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe
};
