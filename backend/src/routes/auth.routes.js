const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

// Register new user
router.post('/register', AuthController.register);

// RFID Login
router.post('/login', AuthController.login);

module.exports = router; 