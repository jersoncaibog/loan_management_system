const express = require('express');
const router = express.Router();
const LoanController = require('../controllers/loan.controller');

// Request a loan
router.post('/request', LoanController.requestLoan);

// Get user's current balance
router.get('/balance/:userId', LoanController.getBalance);

module.exports = router; 