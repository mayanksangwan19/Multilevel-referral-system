const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');

router.post('/register', registerUser);

const userController = require('../controllers/userController');

router.get('/report/:userId', userController.getReferralReport);
module.exports = router;
