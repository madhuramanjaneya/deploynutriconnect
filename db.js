const mysql = require("mysql2/promise");
const fs = require("fs");

// Load environment variables and check if it works
require("dotenv").config();
console.log("DB_HOST from .env:", process.env.DB_HOST);
console.log("DB_PORT from .env:", process.env.DB_PORT);
console.log("DB_USER from .env:", process.env.DB_USER);
console.log("DB_NAME from .env:", process.env.DB_NAME);


// ✅ Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 14079, // Use DB_PORT from .env, or default to 14079
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(), // Load Aiven CA certificate
  },
});

// ✅ Test the connection
async function testConnection() {
  console.log("Connecting to Aiven MySQL with:");
  console.log("Host:", process.env.DB_HOST);
  console.log("Port:", process.env.DB_PORT);
  console.log("User:", process.env.DB_USER);
  console.log("Database:", process.env.DB_NAME);
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to Aiven MySQL database successfully!");
    connection.release();
  } catch (error) {
    console.error("❌ Failed to connect to Aiven MySQL:", error);
    console.error("Connection Error Details:", error); // Show full error object
  }
}

testConnection();

// ✅ Export the pool
module.exports = pool;
