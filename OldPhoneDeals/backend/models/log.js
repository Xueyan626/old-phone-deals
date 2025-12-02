// models/log.js
const mongoose = require('./dbConfig');

const logSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['order', 'admin_action'],
    required: true
  },
  action: { type: String, required: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // user or admin
  target: { type: String },  // object UserId / PhoneId / ReviewId
  metadata: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
}, {
  versionKey: false,
  collection: 'logs'
});

module.exports = mongoose.model('Log', logSchema);