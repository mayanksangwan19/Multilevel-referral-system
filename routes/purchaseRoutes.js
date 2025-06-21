const express = require('express');
const router = express.Router();

const { makePurchase } = require('../controllers/purchaseController');

// Purchase route
router.post('/buy', makePurchase);

module.exports = router;
