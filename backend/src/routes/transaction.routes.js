const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/transaction.controller');

// Make a payment
router.post('/payment', TransactionController.makePayment);

// Get transaction history
router.get('/history/:userId', TransactionController.getHistory);

module.exports = router; 