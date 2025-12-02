const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

router.get('/profile', verifyToken, user.getProfile);
router.put('/profile', verifyToken, user.updateProfile);
router.put('/password', verifyToken, user.changePassword);

module.exports = router;