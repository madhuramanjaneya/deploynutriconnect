const mysql = require("mysql2/promise");

// ✅ Create a connection pool for better efficiency
const pool = mysql.createPool({
  host: "localhost",
  user: "root",  // Use your MySQL username
  password: "",  // Your MySQL password (leave empty if not set)
  database: "nutritionist_app",
  waitForConnections: true,
  connectionLimit: 10,  // Limits max concurrent connections
  queueLimit: 0
});

// ✅ Export the pool to use in other files
module.exports = pool;
