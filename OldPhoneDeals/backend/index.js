//.env
require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('./models/dbConfig');
const app = express();
const PORT = 3000;

//allow to access by other port
const cors = require('cors');
app.use(cors());

// handle json request
app.use(express.json());

//set up public file as static resource path
app.use('/images', express.static(path.join(__dirname, 'public/images')));

//upload from frontend path
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// load all router
app.use('/api/auth', require('./router/authRoutes'));
app.use('/api/user', require('./router/userRoutes'));
app.use('/api/phones', require('./router/phoneRoutes'));
app.use('/api/reviews', require('./router/reviewRoutes'));
app.use('/api/cart', require('./router/cartRoutes'));
app.use('/api/admin', require('./router/adminRoutes'));

// test default router
app.get('/', (req, res) => {
  res.send('Welcome to Node.js + MongoDB + Vue Project!');
});

// start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});