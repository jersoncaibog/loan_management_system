# RFID-Based Loan Management System Requirements

## Overview

A loan management platform that utilizes RFID technology for user authentication and loan management. The system allows users to request loans, manage their debt, and view their transaction history using RFID cards as their primary authentication method.

## Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- ShadCN UI (New York Style - Light Mode)

### Backend

- Node.js
- Express.js

### Database

- MySQL

### Additional Technologies

- Node-MySQL2 for database connection
- CORS for cross-origin resource sharing
- Dotenv for environment variables

## Core Features

### 1. User Authentication

- RFID-based login system
  - Users can log in by scanning their RFID card
  - No additional password required for login
- User registration/signup process
  - Collection of basic user information
  - RFID card assignment and registration
  - Initial account setup

### 2. Loan Management

- Loan Request Feature
  - Digital loan disbursement form
  - Amount input field
  - "Request Loan" button
  - Loan approval process
- Debt Balance Tracking
  - Real-time debt balance display
  - Outstanding loan amount
  - Payment due dates
  - Interest calculations (if applicable)

### 3. Transaction History

- Comprehensive transaction log
  - Loan disbursements
  - Payments made
  - Date and time stamps
  - Transaction types
  - Amount details

## Technical Requirements

### Software Requirements

- Backend database for user and transaction storage
- RFID integration software
- Secure authentication system
- Real-time data processing

## Security Requirements

- Secure RFID card data storage
- Encryption for sensitive information
- Transaction verification system
- Audit logging
- Session management
- Data backup and recovery systems

## User Interface Requirements

- Clean and intuitive interface by copying the design of New York Style from ShadCDN UI but in light mode only
- Mobile Responsive
- Clear error messages and notifications
- Custom Modals instead of using javascript alert() or confirm()

## Data Requirements

### User Data

- User ID
- RFID Card Number
- Full Name
- Contact Information
- Account Creation Date
- Loan History
- Current Balance

### Transaction Data

- Transaction ID
- User ID
- Transaction Type
- Amount
- Date and Time
- Status
- Related Loan Information

## Database Schema

### Tables

#### 1. users

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rfid_number VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    current_balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. transactions

```sql
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('loan_request', 'loan_payment') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    due_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```
