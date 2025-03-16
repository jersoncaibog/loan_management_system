USE melan_loan_management;
-- Disable foreign key checks and truncate tables in correct order
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE transactions;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;
-- Insert 3 sample users
INSERT INTO users (rfid_number, full_name, email, phone_number)
VALUES (
        'RFID001',
        'John Smith',
        'john.smith@email.com',
        '09123456789'
    ),
    (
        'RFID002',
        'Emma Johnson',
        'emma.j@email.com',
        '09234567890'
    ),
    (
        'RFID003',
        'Michael Brown',
        'michael.b@email.com',
        '09345678901'
    );
-- Wait for users to be inserted before adding transactions
SET @john_id = (
        SELECT id
        FROM users
        WHERE rfid_number = 'RFID001'
    );
SET @emma_id = (
        SELECT id
        FROM users
        WHERE rfid_number = 'RFID002'
    );
SET @michael_id = (
        SELECT id
        FROM users
        WHERE rfid_number = 'RFID003'
    );
-- Insert 10 sample transactions for each user (total 30 transactions)
INSERT INTO transactions (
        user_id,
        type,
        amount,
        status,
        due_date,
        description
    )
VALUES -- John Smith's transactions
    (
        @john_id,
        'loan_request',
        5000.00,
        'approved',
        DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY),
        'Personal loan'
    ),
    (
        @john_id,
        'loan_payment',
        1000.00,
        'completed',
        NULL,
        'First payment'
    ),
    (
        @john_id,
        'loan_request',
        3000.00,
        'approved',
        DATE_ADD(CURRENT_DATE, INTERVAL 45 DAY),
        'Emergency funds'
    ),
    (
        @john_id,
        'loan_payment',
        500.00,
        'completed',
        NULL,
        'Monthly payment'
    ),
    (
        @john_id,
        'loan_request',
        7500.00,
        'pending',
        DATE_ADD(CURRENT_DATE, INTERVAL 60 DAY),
        'Business expansion'
    ),
    (
        @john_id,
        'loan_payment',
        1500.00,
        'completed',
        NULL,
        'Extra payment'
    ),
    (
        @john_id,
        'loan_request',
        2000.00,
        'rejected',
        NULL,
        'Vacation expenses'
    ),
    (
        @john_id,
        'loan_payment',
        800.00,
        'completed',
        NULL,
        'Regular payment'
    ),
    (
        @john_id,
        'loan_request',
        4000.00,
        'approved',
        DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY),
        'Home repairs'
    ),
    (
        @john_id,
        'loan_payment',
        1200.00,
        'completed',
        NULL,
        'Final payment'
    ),
    -- Emma Johnson's transactions
    (
        @emma_id,
        'loan_request',
        10000.00,
        'approved',
        DATE_ADD(CURRENT_DATE, INTERVAL 90 DAY),
        'Business startup'
    ),
    (
        @emma_id,
        'loan_payment',
        2000.00,
        'completed',
        NULL,
        'First installment'
    ),
    (
        @emma_id,
        'loan_request',
        5000.00,
        'rejected',
        NULL,
        'Car repairs'
    ),
    (
        @emma_id,
        'loan_payment',
        1500.00,
        'completed',
        NULL,
        'Monthly payment'
    ),
    (
        @emma_id,
        'loan_request',
        8000.00,
        'approved',
        DATE_ADD(CURRENT_DATE, INTERVAL 60 DAY),
        'Education expenses'
    ),
    (
        @emma_id,
        'loan_payment',
        2500.00,
        'completed',
        NULL,
        'Advance payment'
    ),
    (
        @emma_id,
        'loan_request',
        3000.00,
        'pending',
        DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY),
        'Medical expenses'
    ),
    (
        @emma_id,
        'loan_payment',
        1000.00,
        'completed',
        NULL,
        'Regular payment'
    ),
    (
        @emma_id,
        'loan_request',
        6000.00,
        'approved',
        DATE_ADD(CURRENT_DATE, INTERVAL 45 DAY),
        'Home renovation'
    ),
    (
        @emma_id,
        'loan_payment',
        1800.00,
        'completed',
        NULL,
        'Monthly installment'
    ),
    -- Michael Brown's transactions
    (
        @michael_id,
        'loan_request',
        15000.00,
        'approved',
        DATE_ADD(CURRENT_DATE, INTERVAL 90 DAY),
        'Business expansion'
    ),
    (
        @michael_id,
        'loan_payment',
        3000.00,
        'completed',
        NULL,
        'First payment'
    ),
    (
        @michael_id,
        'loan_request',
        7000.00,
        'pending',
        DATE_ADD(CURRENT_DATE, INTERVAL 45 DAY),
        'Equipment purchase'
    ),
    (
        @michael_id,
        'loan_payment',
        2000.00,
        'completed',
        NULL,
        'Monthly payment'
    ),
    (
        @michael_id,
        'loan_request',
        4000.00,
        'rejected',
        NULL,
        'Travel expenses'
    ),
    (
        @michael_id,
        'loan_payment',
        1500.00,
        'completed',
        NULL,
        'Regular payment'
    ),
    (
        @michael_id,
        'loan_request',
        9000.00,
        'approved',
        DATE_ADD(CURRENT_DATE, INTERVAL 60 DAY),
        'Inventory purchase'
    ),
    (
        @michael_id,
        'loan_payment',
        2500.00,
        'completed',
        NULL,
        'Extra payment'
    ),
    (
        @michael_id,
        'loan_request',
        6000.00,
        'approved',
        DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY),
        'Working capital'
    ),
    (
        @michael_id,
        'loan_payment',
        2000.00,
        'completed',
        NULL,
        'Monthly installment'
    );
-- Update user balances based on transactions
UPDATE users u
    JOIN (
        SELECT user_id,
            SUM(
                CASE
                    WHEN type = 'loan_request'
                    AND status = 'approved' THEN amount
                    WHEN type = 'loan_payment'
                    AND status = 'completed' THEN - amount
                    ELSE 0
                END
            ) as balance_change
        FROM transactions
        GROUP BY user_id
    ) t ON u.id = t.user_id
SET u.current_balance = t.balance_change;