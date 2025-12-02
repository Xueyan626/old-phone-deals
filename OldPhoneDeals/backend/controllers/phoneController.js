const Phone = require('../models/phone');
const fs = require('fs');
const path = require('path');

//Get all phone
exports.getAllPhones = async (req, res) => {
  try {
    const { brand, minPrice, maxPrice, search } = req.query;

    const query = { disabled: { $ne: true } };

    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) query.title = { $regex: search, $options: 'i' };

    const phones = await Phone.find(query).populate('seller', 'firstname lastname');
    res.json({ success: true, data: phones });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get phones', error: err.message });
  }
};

//Get phone by searching
exports.getPhoneById = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id).populate('seller', 'firstname lastname');
    if (!phone) return res.status(404).json({ success: false, message: 'Phone not found' });

    res.json({ success: true, data: phone });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error', error: err.message });
  }
};

exports.createPhone = async (req, res) => {
  try {
    const { title, brand, price, stock } = req.body;
    const seller = req.user.id;

    // check the brand of new create wether exist
    const brandImagePath = `/images/${brand}.jpeg`;
    const localPath = path.join(__dirname, '..', 'public', brandImagePath);

    let imagePath = '';

    if (fs.existsSync(localPath)) {
      // brand already exist
      imagePath = brandImagePath;
    } else if (req.file) {
      // brand not exist with new image will be store in upload, url will be stored in DB
      imagePath = `/uploads/${req.file.filename}`;
    } else {
      // brand does not exist without new images will be refused
      return res.status(400).json({ success: false, message: `Brand "${brand}" not supported. Please upload an image for this new brand.` });
    }

    const phone = await Phone.create({
      title,
      brand,
      price,
      stock,
      seller,
      image: imagePath
    });

    res.status(201).json({ success: true, data: phone });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//maybe no call, check later
exports.updatePhone = async (req, res) => {
  try {
    const phone = await Phone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.json({ success: true, message: 'Phone updated', data: phone });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed', error: err.message });
  }
};

//Delete the phone
exports.deletePhone = async (req, res) => {
  try {
    await Phone.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Phone deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed', error: err.message });
  }
};

// exports.disablePhone = async (req, res) => {
//   try {
//     await Phone.findByIdAndUpdate(req.params.id, { disabled: true });
//     res.json({ success: true, message: 'Phone disabled' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Disable failed', error: err.message });
//   }
// };

//Get best sellers
exports.getBestSellers = async (req, res) => {
  try {
    const topPhones = await Phone.find({ disabled: { $ne: true } }).sort({ sold: -1 }).limit(5);
    res.json({ success: true, data: topPhones });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get best sellers', error: err.message });
  }
};

exports.getSoldOutSoon = async (req, res) => {
  try {
    const phones = await Phone.find({ disabled: { $ne: true } }).sort({ stock: 1 }).limit(5);
    res.json({ success: true, data: phones });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get stock list', error: err.message });
  }
};

//Set disable status for phone
exports.disablePhone = async (req, res) => {
  try {
    const { id } = req.params;
    const phone = await Phone.findByIdAndUpdate(id, { disabled: true }, { new: true });
    if (!phone) return res.status(404).json({ success: false, message: 'Phone not found' });
    res.json({ success: true, message: 'Phone disabled', data: phone });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};


//Set active status for phone
exports.enablePhone = async (req, res) => {
  try {
    const { id } = req.params;
    const phone = await Phone.findByIdAndUpdate(id, { disabled: false }, { new: true });
    if (!phone) return res.status(404).json({ success: false, message: 'Phone not found' });
    res.json({ success: true, message: 'Phone enabled', data: phone });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getMyPhones = async (req, res) => {
  try {
    const phones = await Phone.find({ seller: req.user.id }).populate('seller', 'firstname lastname');
    res.json({ success: true, data: phones });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get phones', error: err.message });
  }
};

//get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Phone.distinct('brand', { disabled: { $ne: true } });
    res.json({ success: true, data: brands });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get brands', error: err.message });
  }
};