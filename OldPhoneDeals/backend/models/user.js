const mongoose = require('./dbConfig');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  isAdmin:   { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
}, {
      versionKey: false,
      collection: 'users'
});

module.exports = mongoose.model('User', userSchema);