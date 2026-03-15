-- MySQL Database Setup for HRMS System
-- Run these commands in MySQL to create the database and tables

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS hrms_system 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. Use the database
USE hrms_system;

-- 3. Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(255) NOT NULL,
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_department (department),
    INDEX idx_status (status)
);

-- 4. Insert sample data (optional)
INSERT INTO employees (name, email, department, position, status) VALUES
('Rahul Sharma', 'rahul@company.com', 'IT', 'Frontend Developer', 'Active'),
('Priya Verma', 'priya@company.com', 'HR', 'HR Manager', 'Active'),
('Amit Singh', 'amit@company.com', 'Finance', 'Accountant', 'Inactive'),
('Sneha Kapoor', 'sneha@company.com', 'IT', 'Backend Developer', 'Active'),
('John Doe', 'john@company.com', 'Marketing', 'Marketing Manager', 'Active'),
('Jane Smith', 'jane@company.com', 'Sales', 'Sales Executive', 'Active'),
('Mike Johnson', 'mike@company.com', 'Operations', 'Operations Manager', 'Active'),
('Sarah Wilson', 'sarah@company.com', 'IT', 'DevOps Engineer', 'Active');

-- 5. Show the table structure (optional)
DESCRIBE employees;

-- 6. Show sample data (optional)
SELECT * FROM employees;

-- Additional useful commands:

-- Create a user for the application (optional)
-- CREATE USER 'hrms_user'@'localhost' IDENTIFIED BY 'your_password';
-- GRANT ALL PRIVILEGES ON hrms_system.* TO 'hrms_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Backup the database
-- mysqldump -u root -p hrms_system > hrms_system_backup.sql

-- Restore the database
-- mysql -u root -p hrms_system < hrms_system_backup.sql
