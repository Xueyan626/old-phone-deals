const express = require('express');
const router = express.Router();
const cart = require('../controllers/cartController');
const verifyToken = require('../middleware/verifyToken');

router.post('/add', verifyToken, cart.addToCart);
router.get('/', verifyToken, cart.getCart);
router.post('/checkout', verifyToken, cart.checkout);

module.exports = router;