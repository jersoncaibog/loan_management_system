const db = require('../config/database');

class User {
  static async findByRFID(rfid_number) {
    const [users] = await db.query(
      'SELECT id, rfid_number, full_name, email, current_balance FROM users WHERE rfid_number = ?',
      [rfid_number]
    );
    return users[0];
  }

  static async findByEmail(email) {
    const [users] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    return users[0];
  }

  static async create(userData) {
    const { rfid_number, full_name, email, phone_number } = userData;
    
    const [result] = await db.query(
      'INSERT INTO users (rfid_number, full_name, email, phone_number) VALUES (?, ?, ?, ?)',
      [rfid_number, full_name, email, phone_number]
    );
    
    return {
      id: result.insertId,
      rfid_number,
      full_name,
      email,
      phone_number
    };
  }

  static async findById(id) {
    const [users] = await db.query(
      'SELECT id, rfid_number, full_name, email, current_balance FROM users WHERE id = ?',
      [id]
    );
    return users[0];
  }

  static async updateBalance(userId, amount) {
    const [result] = await db.query(
      'UPDATE users SET current_balance = current_balance - ? WHERE id = ?',
      [amount, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = User; 