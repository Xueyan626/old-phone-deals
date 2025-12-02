// controllers/authController.js

//require('dotenv').config();

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

//signup
exports.signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    //check user exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

    //hash password and create account
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstname, lastname, email, password: hashedPassword });

    //creat token for email verification
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const verificationLink = `http://localhost:3000/api/auth/verify/${token}`;

    // send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Verify your email address',
      html: `
        <h3>Hello ${firstname}</h3>
        <p>Thank you for signing up!</p>
        <p>Please verify your email by clicking this link:</p>
        <a href="${verificationLink}">Verify Email</a>
      `
    });

    console.log(`Verification email sent to ${email}`);
    res.status(201).json({ success: true, message: 'User registered. Verification email sent.', data: user });
  
  } catch (err) {
    console.log('111111111');
    console.error('Error in signup:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid password' });

    //check verified
    if (!user.verified) return res.status(403).json({ success: false, message: 'Please verify your email before logging in.' });
    
    //Token will expire in 2hours
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ success: true, message: 'Login successful', token, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

//request to change
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `http://localhost:5173/reset-password/${token}`; // 前端重置页面

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>Hi ${user.firstname},</p>
        <p>You requested to reset your password. Please click the link below:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request to reset password, please contact us for help. +61 0416647310</p>
      `
    });

    console.log(`Password reset link sent to ${email}`);
    res.json({ success: true, message: 'Password reset email sent' });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully' });

  } catch (err) {
    res.status(400).json({ success: false, message: 'Invalid or expired token', error: err.message });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    // check token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // log
    console.log(`User ${decoded.email} verified successfully`);

    //set user.verified
    await User.updateOne({ _id: decoded.id }, { $set: { verified: true } })

    // redirect to home page
    return res.redirect('http://localhost:5173/verify-success');
  } catch (err) {
    console.error('Email verification failed:', err);
    return res.status(400).send('Invalid or expired token');
  }
};