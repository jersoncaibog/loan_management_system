const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');

class LoanController {
  static async requestLoan(req, res) {
    try {
      const { user_id, amount, purpose } = req.body;

      if (!user_id || !amount || !purpose) {
        return res.status(400).json({
          success: false,
          message: 'User ID, amount, and purpose are required'
        });
      }

      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const result = await Transaction.createLoanRequest(user_id, amount, purpose);

      res.json({
        success: true,
        message: 'Loan request submitted successfully',
        data: result
      });
    } catch (error) {
      console.error('Loan request error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing loan request'
      });
    }
  }

  static async getBalance(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const current_balance = await Transaction.getCurrentBalance(userId);
      const interest_rate = 0.06; // 6% fixed interest rate
      const interest_amount = current_balance * interest_rate;

      res.json({
        success: true,
        data: {
          current_balance,
          interest_rate,
          interest_amount,
          total_amount: current_balance + interest_amount
        }
      });
    } catch (error) {
      console.error('Balance check error:', error);
      res.status(500).json({
        success: false,
        message: 'Error checking balance'
      });
    }
  }
}

module.exports = LoanController; 