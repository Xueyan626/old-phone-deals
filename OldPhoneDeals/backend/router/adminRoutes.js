const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

// protect all admin api
router.use(verifyToken, isAdmin);

//user part
router.get('/users/:id/name', admin.getUserNameById);
router.get('/users', admin.getAllUsers);
router.put('/users/:id', admin.updateUser);
router.patch('/users/disable/:id', admin.disableUser);
router.patch('/users/enable/:id', admin.enableUser);
router.delete('/users/:id', admin.deleteUser);

//phone part
router.get('/phones', admin.getAllPhonesAdmin);
router.patch('/phones/disable/:id', admin.disablePhone);
router.patch('/phones/enable/:id', admin.enablePhone);
router.delete('/phones/:id', admin.deletePhone);
router.get('/users/:id/listings', admin.getPhoneByUser);

//review part
router.get('/reviews', admin.getAllReviewsAdmin);
router.patch('/reviews/:phoneId/:reviewId/toggle', admin.toggleReviewVisibility);
router.delete('/reviews/:phoneId/:reviewId', admin.deleteReview);
router.get('/reviews/user/:id', admin.getReviewsByUser);
router.patch('/reviews/toggle', verifyToken, isAdmin, admin.toggleReviewWithoutId);

//logs part
router.get('/logs', admin.getLogs);
router.get('/logs/export', admin.exportLogs);

module.exports = router;