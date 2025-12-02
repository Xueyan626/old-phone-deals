const Phone = require('../models/phone');
const mongoose = require('mongoose');

//Add new review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const phoneId = req.params.id;

    const review = {
      reviewer: req.user.id,
      rating,
      comment,
      hidden: false
    };

    const updatedPhone = await Phone.findByIdAndUpdate(
      phoneId,
      { $push: { reviews: review } },
      { new: true }
    );

    res.status(201).json({ success: true, message: 'Review added', data: updatedPhone.reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add review', error: err.message });
  }
};

//Get review 改了
exports.getReviews = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id)
      .populate('reviews.reviewer', 'firstname lastname');

    if (!phone) {
      return res.status(404).json({ success: false, message: 'Phone not found' });
    }

    const currentUserId = req.user?.id?.toString?.();

    const filteredReviews = phone.reviews.filter(r => {
      if (!r.reviewer) return false;

      const reviewerId =
        typeof r.reviewer === 'object'
          ? r.reviewer._id?.toString?.()
          : r.reviewer?.toString?.();

      return !r.hidden || reviewerId === currentUserId;
    });

    return res.json({ success: true, data: filteredReviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get reviews', error: err.message });
  }
};


//
exports.getReviewsPaginated = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id).populate('reviews.reviewer', 'firstname');

    const offset = parseInt(req.query.offset) || 0;
    const limit = 5;

    const visible = phone.reviews.filter(r => r.hidden !== true);
    const paginated = visible.slice(offset, offset + limit);

    res.json({ success: true, data: paginated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to paginate reviews', error: err.message });
  }
};

// Hide review
exports.hideReview = async (req, res) => {
  try {
    const { phoneId, reviewId } = req.params;
    const phone = await Phone.findById(phoneId);
    if (!phone) return res.status(404).json({ success: false, message: 'Phone not found' });

    const review = phone.reviews.id(reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    review.hidden = true;
    await phone.save();
    res.json({ success: true, message: 'Review hidden' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// show the hidden review
exports.unhideReview = async (req, res) => {
  try {
    const { phoneId, reviewId } = req.params;
    const phone = await Phone.findById(phoneId);
    if (!phone) return res.status(404).json({ success: false, message: 'Phone not found' });

    const review = phone.reviews.id(reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    review.hidden = false;
    await phone.save();
    res.json({ success: true, message: 'Review unhidden' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getMyListingsReviews = async (req, res) => {
  try {
    const phones = await Phone.find({ seller: req.user.id });
    const allReviews = phones.flatMap(phone =>
      phone.reviews.map(review => ({
        phoneTitle: phone.title,
        phoneId: phone._id,
        reviewId: review._id,
        reviewer: review.reviewer,
        rating: review.rating,
        comment: review.comment,
        hidden: review.hidden
      }))
    );
    res.json({ success: true, data: allReviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get reviews', error: err.message });
  }
};