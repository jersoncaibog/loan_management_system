// Backend API URL (development)
const API_URL = 'http://localhost:3000/api'

class ApiService {
  static async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async login(rfidNumber) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rfid_number: rfidNumber }),
      });
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async requestLoan(userId, amount, purpose) {
    try {
      const response = await fetch(`${API_URL}/loans/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, amount, purpose }),
      });
      return await response.json();
    } catch (error) {
      console.error('Loan request error:', error);
      throw error;
    }
  }

  static async getBalance(userId) {
    try {
      const response = await fetch(`${API_URL}/loans/balance/${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Balance check error:', error);
      throw error;
    }
  }

  static async makePayment(userId, amount, cardNumber) {
    try {
      const response = await fetch(`${API_URL}/transactions/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          amount,
          card_number: cardNumber,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }

  static async getTransactionHistory(userId, limit = 30, offset = 0) {
    try {
      const response = await fetch(
        `${API_URL}/transactions/history/${userId}?limit=${limit}&offset=${offset}`
      );
      return await response.json();
    } catch (error) {
      console.error('Transaction history error:', error);
      throw error;
    }
  }
}

// Store user session data
const SessionStorage = {
  setUser(userData) {
    sessionStorage.setItem('user', JSON.stringify(userData));
  },

  getUser() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  clearUser() {
    sessionStorage.removeItem('user');
  },
};

window.ApiService = ApiService;
window.SessionStorage = SessionStorage;
