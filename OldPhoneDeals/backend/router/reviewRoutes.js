const express = require('express');
const router = express.Router();
const review = require('../controllers/reviewController');
const verifyToken = require('../middleware/verifyToken');

router.post('/:id/reviews', verifyToken, review.addReview);
router.get('/:id/reviews', verifyToken, review.getReviews);
router.get('/:id/reviews/paginated', review.getReviewsPaginated);
router.patch('/:phoneId/reviews/:reviewId/hide', verifyToken, review.hideReview);
router.patch('/:phoneId/reviews/:reviewId/unhide', verifyToken, review.unhideReview);
router.get('/my/listings/reviews', verifyToken, review.getMyListingsReviews);

module.exports = router;