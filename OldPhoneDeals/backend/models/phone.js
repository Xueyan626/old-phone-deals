const mongoose = require('./dbConfig');

const phoneSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  brand:   { type: String, required: true },
  image:   { type: String },
  price:   { type: Number, required: true },
  stock:   { type: Number, default: 0 },
  seller:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  disabled:{ type: Boolean, default: false},

  reviews: [{
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating:   { type: Number, min: 1, max: 5 },
    comment:  { type: String },
    hidden:   { type: Boolean, default: false}
  }]
}, {
      versionKey: false,
      collection: 'phones'
});

module.exports = mongoose.model('Phone', phoneSchema);