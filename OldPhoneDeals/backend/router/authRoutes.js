const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/signup', auth.signup);
router.post('/login', auth.login);
//router.get('/verify', auth.verifyEmail);
router.post('/reset-request', auth.requestPasswordReset);
router.post('/reset-password', auth.resetPassword);
router.get('/verify/:token', auth.verifyEmail);//New adding

module.exports = router;