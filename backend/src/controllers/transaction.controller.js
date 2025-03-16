const db = require('../config/database');
const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');

class TransactionController {
  static async makePayment(req, res) {
    try {
      const { user_id, amount, card_number } = req.body;

      if (!user_id || !amount || !card_number) {
        return res.status(400).json({
          success: false,
          message: 'User ID, amount, and card number are required'
        });
      }

      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Start a transaction to ensure data consistency
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        const result = await Transaction.processPaymentTransaction(connection, user_id, amount);
        await connection.commit();

        res.json({
          success: true,
          message: 'Payment processed successfully',
          data: result
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing payment'
      });
    }
  }

  static async getHistory(req, res) {
    try {
      const { userId } = req.params;
      const { limit, offset } = req.query;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const result = await Transaction.getHistory(userId, limit, offset);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Transaction history error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching transaction history'
      });
    }
  }
}

module.exports = TransactionController; 