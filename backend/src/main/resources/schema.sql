-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    profile_image VARCHAR(255)
);

-- Create Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date TIMESTAMP NOT NULL,
    type VARCHAR(50) NOT NULL,
    payment_method VARCHAR(100),
    currency VARCHAR(50),
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_dates ON budgets(start_date, end_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);