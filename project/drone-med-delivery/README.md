# Drone Delivery System 🚀

## *Overview*
The Drone Delivery System is a *serverless application* for managing *drone-based medical deliveries*. It provides:
- 🚁 *Drone registration*
- 🔋 *Battery audit logging*
- 📦 *Order placing & order tracking*
- 📜 *PDF report generation for battery logs & drone statuses*

---

## *📌 Table of Contents*
- [1. Prerequisites](#1-prerequisites)
- [2. Installation](#2-installation)
- [3. Database Setup](#3-database-setup-mariadb)
- [4. Redis Setup](#4-redis-setup)
- [5. Environment Variables](#5-environment-variables)
- [6. Running the Project](#6-running-the-project)

---

## *1️⃣ Prerequisites*
Ensure you have the following installed:
- *Node.js (v18+)* → [Download Here](https://nodejs.org/en/)
- *MariaDB or MySQL* → [Download Here](https://mariadb.org/download/)
- *Redis* → [Installation Guide](https://redis.io/docs/getting-started/installation/)
- *Serverless Framework (v3)* → [Installation Guide](https://www.serverless.com/framework/docs/getting-started/)
- *TypeScript* → [Installation Guide](https://www.typescriptlang.org/)

---

## *2️⃣ Installation*

# Install dependencies
npm install

# Install Serverless Framework (v3)
npm install -g serverless@3

# Install Redis client
npm install ioredis


*3️⃣ Database Setup*
--------------------------------

### **🔑 Create Database & Tables**

CREATE DATABASE drone_delivery;
USE drone_delivery;

CREATE TABLE owners (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL
);

CREATE TABLE drones (
id INT AUTO_INCREMENT PRIMARY KEY,
model VARCHAR(255),
weight_limit FLOAT,
battery_capacity FLOAT,
battery_level FLOAT,
status ENUM('IDLE', 'LOADING', 'DELIVERING', 'RETURNING'),
current_latitude FLOAT,
current_longitude FLOAT,
owner_id INT,
FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE
);

CREATE TABLE drone_battery_audit (
id INT AUTO_INCREMENT PRIMARY KEY,
drone_id INT,
old_battery_level FLOAT,
new_battery_level FLOAT,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (drone_id) REFERENCES drones(id) ON DELETE CASCADE
);

CREATE TABLE orders (
id INT AUTO_INCREMENT PRIMARY KEY,
medication_id INT,
customer_id VARCHAR(255),
drone_id INT,
status VARCHAR(255),
drop_latitude FLOAT,
drop_longitude FLOAT,
FOREIGN KEY (drone_id) REFERENCES drones(id) ON DELETE CASCADE
);



*4️⃣ Redis Setup*
-------------------

### *💎 Install Redis*

sh
sudo apt update
sudo apt install redis-server
sudo systemctl enable redis
sudo systemctl start redis


### *🛠️ Verify Redis Installation*

sh
redis-cli ping

*5️⃣ Environment Variables*
-----------------------------

Create a .env file in the project root:
sh
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=drone_delivery
REDIS_HOST=localhost
REDIS_PORT=6380

*6️⃣ Running the Project*
---------------------------

### *🚲 Start Local Services*

sh
sudo systemctl start redis

### *🛠️ Run Serverless Offline*

sh
serverless offline
