const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/eCommerce';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;