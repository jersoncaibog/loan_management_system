const User = require('../models/User.model');

class AuthController {
  static async register(req, res) {
    try {
      const { rfid_number, full_name, email, phone_number } = req.body;

      // Validate required fields
      if (!rfid_number || !full_name || !email) {
        return res.status(400).json({
          success: false,
          message: 'RFID number, full name, and email are required'
        });
      }

      // Check if RFID number already exists
      const existingRFID = await User.findByRFID(rfid_number);
      if (existingRFID) {
        return res.status(400).json({
          success: false,
          message: 'RFID number already registered'
        });
      }

      // Check if email already exists
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // Create new user
      const user = await User.create({
        rfid_number,
        full_name,
        email,
        phone_number
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user_id: user.id,
          full_name: user.full_name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Error during registration'
      });
    }
  }

  static async login(req, res) {
    try {
      const { rfid_number } = req.body;

      if (!rfid_number) {
        return res.status(400).json({
          success: false,
          message: 'RFID number is required'
        });
      }

      const user = await User.findByRFID(rfid_number);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid RFID card'
        });
      }

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user_id: user.id,
          full_name: user.full_name,
          email: user.email,
          current_balance: user.current_balance
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Error during login'
      });
    }
  }
}

module.exports = AuthController; 