const User = require('../models/user');
const Phone = require('../models/phone');
const Log = require('../models/log');
const mongoose = require('mongoose');
const { Parser } = require('json2csv'); // for exporting CSV files

//Handling the admin logic in this controller

//func of user
//Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get users', error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    }).select('-password');

    await Log.create({
      type: 'admin_action',
      action: 'UPDATE_USER',
      actor: req.user.id,
      target: req.params.id,
      metadata: req.body
    });

    res.json({ success: true, message: 'User updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update user', error: err.message });
  }
};

//disable user
exports.disableUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { disabled: true });

    await Log.create({
      type: 'admin_action',
      action: 'DISABLE_USER',
      actor: req.user.id,
      target: req.params.id
    });

    res.json({ success: true, message: 'User disabled' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to disable user', error: err.message });
  }
};

//enable user
exports.enableUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { disabled: false });

    await Log.create({
      type: 'admin_action',
      action: 'ENABLE_USER',
      actor: req.user.id,
      target: req.params.id
    });

    res.json({ success: true, message: 'User enabled' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to enable user', error: err.message });
  }
};

//delete user in DB
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    await Log.create({
      type: 'admin_action',
      action: 'DELETE_USER',
      actor: req.user.id,
      target: req.params.id
    });

    res.json({ success: true, message: 'User permanently deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete user', error: err.message });
  }
};

//return full name
exports.getUserNameById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('firstname lastname');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, name: `${user.firstname} ${user.lastname}` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user name', error: err.message });
  }
};

//func of phone
//get all phone
exports.getAllPhonesAdmin = async (req, res) => {
  try {
    const phones = await Phone.find().populate('seller', 'firstname lastname');
    res.json({ success: true, data: phones });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get phones', error: err.message });
  }
};


//disable phone
exports.disablePhone = async (req, res) => {
  try {
    await Phone.findByIdAndUpdate(req.params.id, { disabled: true });

    await Log.create({
      type: 'admin_action',
      action: 'DISABLE_PHONE',
      actor: req.user.id,
      target: req.params.id
    });

    res.json({ success: true, message: 'Phone disabled' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to disable phone', error: err.message });
  }
};

//enable phone
exports.enablePhone = async (req, res) => {
  try {
    await Phone.findByIdAndUpdate(req.params.id, { disabled: false });

    await Log.create({
      type: 'admin_action',
      action: 'ENABLE_PHONE',
      actor: req.user.id,
      target: req.params.id
    });

    res.json({ success: true, message: 'Phone enabled' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to enable phone', error: err.message });
  }
};

//find phone by user
exports.getPhoneByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    //console.log('get ID:', userId);

    const phones = await Phone.find({ seller: userId });  //string match
    const user = await User.findById(userId).select('firstname lastname');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: phones, user });
  } catch (err) {
    console.error('failed to enquiry', err);
    res.status(500).json({ success: false, message: 'Error fetching listings', error: err.message });
  }
};

//delete phone in DB
exports.deletePhone = async (req, res) => {
  try {
    await Phone.findByIdAndDelete(req.params.id);

    await Log.create({
      type: 'admin_action',
      action: 'DELETE_PHONE',
      actor: req.user.id,
      target: req.params.id
    });

    res.json({ success: true, message: 'Phone permanently deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete phone', error: err.message });
  }
};

//func of review part
//get all review
exports.getAllReviewsAdmin = async (req, res) => {
  try {
    const phones = await Phone.find().populate('reviews.reviewer', 'firstname lastname');
    let allReviews = [];

    phones.forEach(phone => {
      phone.reviews.forEach(r => {
        allReviews.push({
          phoneTitle: phone.title,
          reviewId: r._id,
          reviewer: r.reviewer,
          rating: r.rating,
          comment: r.comment,
          hidden: r.hidden,
          phoneId: phone._id
        });
      });
    });

    res.json({ success: true, data: allReviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get reviews', error: err.message });
  }
};

//change the status of review
exports.toggleReviewVisibility = async (req, res) => {
  try {
    const { phoneId, reviewId } = req.params;
    const phone = await Phone.findById(phoneId);
    const review = phone.reviews.id(reviewId);

    review.hidden = !review.hidden;
    await phone.save();

    await Log.create({
      type: 'admin_action',
      action: 'TOGGLE_REVIEW',
      actor: req.user.id,
      target: reviewId,
      metadata: { phoneId, newStatus: review.hidden }
    });

    res.json({ success: true, message: `Review visibility set to ${review.hidden}` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to toggle review', error: err.message });
  }
};

// toggleReviewWithoutId
exports.toggleReviewWithoutId = async (req, res) => {
  const { phoneId, reviewerId, comment } = req.body;

  try {
    const phone = await Phone.findById(phoneId);
    if (!phone) return res.status(404).json({ success: false, message: 'Phone not found' });

    const review = phone.reviews.find(r =>
      r.reviewer.toString() === reviewerId &&
      r.comment === comment
    );

    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    review.hidden = !review.hidden;
    await phone.save();

    res.json({
      success: true,
      message: `Review is now ${review.hidden ? 'hidden' : 'visible'}`,
      hidden: review.hidden
    });
  } catch (err) {
    console.error('[toggleReviewWithoutId] ERROR:', err);
    res.status(500).json({ success: false, message: 'Toggle failed', error: err.message });
  }
};

//delete review in DB
exports.deleteReview = async (req, res) => {
  try {
    const { phoneId, reviewId } = req.params;
    const phone = await Phone.findById(phoneId);
    if (!phone) return res.status(404).json({ success: false, message: 'Phone not found' });

    phone.reviews = phone.reviews.filter(r => r._id.toString() !== reviewId);
    await phone.save();

    await Log.create({
      type: 'admin_action',
      action: 'DELETE_REVIEW',
      actor: req.user.id,
      target: reviewId,
      metadata: { phoneId }
    });

    res.json({ success: true, message: 'Review permanently deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete review', error: err.message });
  }
};

//find review by user
exports.getReviewsByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Written reviews: where user wrote review on other sellers' phones
    const phonesWithWritten = await Phone.find({ 'reviews.reviewer': userId })
      .populate('reviews.reviewer', 'firstname lastname')
      .select('title price reviews')

    const written = []
    phonesWithWritten.forEach(phone => {
      phone.reviews.forEach(r => {
        if (r.reviewer && r.reviewer._id.toString() === userId) {
          written.push({
            title: phone.title,
            price: phone.price,
            review: r.comment,
            date: r.date,
            reviewer: r.reviewer
          })
        }
      })
    })

    // Received reviews: phones owned by this user
    const phonesWithReceived = await Phone.find({ seller: userId })
      .populate('reviews.reviewer', 'firstname lastname')
      .select('title price reviews')

    const received = []
    phonesWithReceived.forEach(phone => {
      phone.reviews.forEach(r => {
        received.push({
          title: phone.title,
          price: phone.price,
          review: r.comment,
          date: r.date,
          reviewer: r.reviewer
        })
      })
    })

    res.json({ success: true, written, received })
  } catch (error) {
    console.error('getReviewsByUser error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
}


//log part
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(2000);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch logs', error: err.message });
  }
};

//providing export csv and json format, up to frontend choosing
exports.exportLogs = async (req, res) => {
  try {
    const format = req.query.format || 'json';
    const logs = await Log.find({ type: 'order' });

    if (format === 'csv') {
      const fields = ['timestamp', 'actor', 'action', 'metadata.totalAmount', 'metadata.items'];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(logs);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=sales_logs.csv');
      res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=sales_logs.json');
      res.send(JSON.stringify(logs, null, 2));
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to export logs', error: err.message });
  }
};