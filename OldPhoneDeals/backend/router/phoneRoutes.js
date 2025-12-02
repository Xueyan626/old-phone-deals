const express = require('express');
const router = express.Router();
const phone = require('../controllers/phoneController');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');

router.get('/', phone.getAllPhones);
router.get('/brands', phone.getAllBrands);
router.get('/bestsellers', phone.getBestSellers);
router.get('/soldoutsoon', phone.getSoldOutSoon);
router.get('/:id', phone.getPhoneById);
router.put('/:id', verifyToken, phone.updatePhone);
router.delete('/:id', verifyToken, phone.deletePhone);
router.patch('/:id/disable', verifyToken, phone.disablePhone);
router.patch('/:id/enable', verifyToken, phone.enablePhone);
router.post('/', verifyToken, upload.single('image'), phone.createPhone);
router.get('/my/listings', verifyToken, phone.getMyPhones);


module.exports = router;