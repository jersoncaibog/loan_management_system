const db = require('../config/database');

class Transaction {
  static async createLoanRequest(userId, amount, purpose) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Insert pending transaction first
      const [pendingResult] = await connection.query(
        'INSERT INTO transactions (user_id, type, amount, status, due_date, description) VALUES (?, "loan_request", ?, "pending", DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), ?)',
        [userId, amount, purpose]
      );

      // Insert approved transaction with 1 minute later timestamp
      const [approvedResult] = await connection.query(
        'INSERT INTO transactions (user_id, type, amount, status, due_date, description, created_at) VALUES (?, "loan_request", ?, "approved", DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), ?, DATE_ADD(NOW(), INTERVAL 1 MINUTE))',
        [userId, amount, purpose]
      );

      await connection.commit();

      return {
        pending_id: pendingResult.insertId,
        approved_id: approvedResult.insertId,
        amount,
        status: 'approved',
        due_date: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)) // 30 days from now
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async createPayment(userId, amount) {
    const [result] = await db.query(
      'INSERT INTO transactions (user_id, type, amount, status) VALUES (?, "loan_payment", ?, "completed")',
      [userId, amount]
    );
    return {
      id: result.insertId,
      amount
    };
  }

  static async getHistory(userId, limit = 30, offset = 0) {
    const [transactions] = await db.query(
      `SELECT id, type, amount, status, due_date, description, created_at 
       FROM transactions 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?',
      [userId]
    );

    return {
      transactions,
      total: countResult[0].total
    };
  }

  static async getCurrentBalance(userId) {
    const [result] = await db.query(
      `SELECT 
        COALESCE(
          SUM(
            CASE
              WHEN type = 'loan_request' AND status = 'approved' THEN amount
              WHEN type = 'loan_payment' AND status = 'completed' THEN -amount
              ELSE 0
            END
          ),
          0
        ) as current_balance
      FROM transactions 
      WHERE user_id = ?`,
      [userId]
    );
    
    return result[0].current_balance;
  }

  static async processPaymentTransaction(connection, userId, amount) {
    // Insert payment transaction
    const [result] = await connection.query(
      'INSERT INTO transactions (user_id, type, amount, status) VALUES (?, "loan_payment", ?, "completed")',
      [userId, amount]
    );

    // Update user's balance
    await connection.query(
      'UPDATE users SET current_balance = current_balance - ? WHERE id = ?',
      [amount, userId]
    );

    return {
      transaction_id: result.insertId,
      amount
    };
  }
}

module.exports = Transaction; 