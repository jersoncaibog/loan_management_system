// Check if user is logged in
function checkAuth() {
  const user = SessionStorage.getUser();
  if (!user && window.location.pathname !== '/index.html') {
    window.location.href = '/index.html';
  }
}

// Loan Request Form Handlers
async function handleLoanSubmit(event) {
  event.preventDefault();

  const user = SessionStorage.getUser();
  if (!user) {
    window.location.href = '/index.html';
    return;
  }

  const amount = document.getElementById("loanAmount").value;
  const purpose = document.getElementById("loanPurpose").value;
  const otherPurpose = document.getElementById("otherPurpose").value;
  const finalPurpose = purpose === 'other' ? otherPurpose : purpose;

  try {
    const response = await ApiService.requestLoan(user.user_id, amount, finalPurpose);
    if (response.success) {
      window.location.href = `/success.html?type=loan&amount=${amount}`;
    } else {
      alert(response.message);
    }
  } catch (error) {
    alert('Error submitting loan request. Please try again.');
  }
}

function initializeLoanForm() {
  const loanForm = document.getElementById("loanForm");
  if (loanForm) {
    checkAuth();
    loanForm.addEventListener("submit", handleLoanSubmit);

    const loanPurposeSelect = document.getElementById("loanPurpose");
    const otherPurposeGroup = document.getElementById("otherPurposeGroup");
    const otherPurposeInput = document.getElementById("otherPurpose");

    function toggleOtherPurpose() {
      if (loanPurposeSelect.value === "other") {
        otherPurposeGroup.classList.remove("hidden");
        otherPurposeInput.required = true;
      } else {
        otherPurposeGroup.classList.add("hidden");
        otherPurposeInput.required = false;
        otherPurposeInput.value = "";
      }
    }

    loanPurposeSelect.addEventListener("change", toggleOtherPurpose);
    toggleOtherPurpose();
  }
}

// Payment Form Handlers
async function handlePaymentSubmit(event) {
  event.preventDefault();

  const user = SessionStorage.getUser();
  if (!user) {
    window.location.href = '/index.html';
    return;
  }

  const amount = document.getElementById("paymentAmount").value;
  const cardNumber = document.getElementById("cardNumber").value;

  try {
    const response = await ApiService.makePayment(user.user_id, amount, cardNumber);
    if (response.success) {
      window.location.href = `/success.html?type=payment&amount=${amount}`;
    } else {
      alert(response.message);
    }
  } catch (error) {
    alert('Error processing payment. Please try again.');
  }
}

async function initializePaymentForm() {
  const paymentForm = document.getElementById("paymentForm");
  if (paymentForm) {
    checkAuth();
    paymentForm.addEventListener("submit", handlePaymentSubmit);

    // Add input formatting for card number
    const cardNumber = document.getElementById("cardNumber");
    if (cardNumber) {
      cardNumber.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/(.{4})/g, "$1 ").trim();
        e.target.value = value;
      });
    }

    // Load and display current balance
    await loadAndDisplayBalance();
  }
}

// Balance Display Handler
async function loadAndDisplayBalance() {
  try {
    const user = SessionStorage.getUser();
    const response = await ApiService.getBalance(user.user_id);
    if (response.success) {
      // Update principal balance
      const balanceAmount = document.querySelector('.balance-amount');
      if (balanceAmount) {
        balanceAmount.textContent = formatCurrency(response.data.current_balance);
      }

      // Update interest amount
      const interestAmount = document.querySelector('.interest-amount');
      if (interestAmount) {
        interestAmount.textContent = formatCurrency(response.data.interest_amount);
      }

      // Update total amount
      const totalAmount = document.querySelector('.total-amount');
      if (totalAmount) {
        totalAmount.textContent = formatCurrency(response.data.total_amount);
      }
    }
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
}

// Transaction History Handler
async function loadTransactionHistory() {
  try {
    const user = SessionStorage.getUser();
    const response = await ApiService.getTransactionHistory(user.user_id);
    
    if (response.success) {
      const tbody = document.getElementById('transactionsTableBody');
      if (!tbody) return;

      tbody.innerHTML = response.data.transactions.map(transaction => `
        <tr>
          <td>${new Date(transaction.created_at).toLocaleDateString()}</td>
          <td>${formatTransactionType(transaction.type)}</td>
          <td>${formatCurrency(transaction.amount)}</td>
          <td><span class="status ${transaction.status.toLowerCase()}">${transaction.status}</span></td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Error fetching transaction history:', error);
  }
}

// Utility Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount);
}

function formatTransactionType(type) {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

// Login Form Handler
async function handleLogin(event) {
  event.preventDefault();
  
  const rfidInput = document.getElementById('rfidInput');
  const rfidNumber = rfidInput.value;

  try {
    const response = await ApiService.login(rfidNumber);
    if (response.success) {
      SessionStorage.setUser(response.data);
      window.location.href = '/menu.html';
    } else {
      alert(response.message);
    }
  } catch (error) {
    alert('Error during login. Please try again.');
  }
}

function initializeLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    
    // Auto-focus on RFID input
    const rfidInput = document.getElementById('rfidInput');
    if (rfidInput) {
      rfidInput.focus();
    }
  }
}

// Success Page Handlers
function initializeSuccessPage() {
  const successTitle = document.getElementById("successTitle");
  if (successTitle) {
    checkAuth();
    
    function getUrlParams() {
      return new URLSearchParams(window.location.search);
    }

    function generateReferenceNumber() {
      const timestamp = Date.now().toString();
      return `REF${timestamp.slice(-8)}`;
    }

    function updateSuccessContent() {
      const params = getUrlParams();
      const type = params.get("type") || "";
      const amount = parseFloat(params.get("amount")) || 0;

      if (type === "loan") {
        document.getElementById("successTitle").textContent =
          "Loan Request Successful!";
        document.getElementById("successDescription").textContent =
          "Your loan request has been submitted successfully and is now pending for approval.";
        document.getElementById("transactionType").textContent = "Loan Request";
      } else if (type === "payment") {
        document.getElementById("successTitle").textContent =
          "Payment Successful!";
        document.getElementById("successDescription").textContent =
          "Your payment has been processed successfully. Thank you!";
        document.getElementById("transactionType").textContent = "Loan Payment";
      }

      document.getElementById("transactionAmount").textContent =
        formatCurrency(amount);
      document.getElementById("transactionDate").textContent =
        new Date().toLocaleString();
      document.getElementById("referenceNumber").textContent =
        generateReferenceNumber();
    }

    updateSuccessContent();
  }
}

// Registration Form Handler
async function handleRegister(event) {
  event.preventDefault();
  
  const userData = {
    rfid_number: document.getElementById('rfidInput').value,
    full_name: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    phone_number: document.getElementById('phoneNumber').value
  };

  try {
    const response = await ApiService.register(userData);
    if (response.success) {
      alert('Registration successful! You can now login.');
      window.location.href = '/index.html';
    } else {
      alert(response.message);
    }
  } catch (error) {
    alert('Error during registration. Please try again.');
  }
}

function initializeRegisterForm() {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
    
    // Auto-focus on RFID input
    const rfidInput = document.getElementById('rfidInput');
    if (rfidInput) {
      rfidInput.focus();
    }
  }
}

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeLoginForm();
  initializeLoanForm();
  initializePaymentForm();
  initializeSuccessPage();
  initializeRegisterForm();
  
  // Load transaction history if on transactions page
  if (document.getElementById('transactionsTableBody')) {
    loadTransactionHistory();
  }
  
  // Load balance if on balance page
  if (document.querySelector('.balance-amount')) {
    loadAndDisplayBalance();
  }
});
