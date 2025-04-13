const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();

// ✅ Enable CORS for frontend communication
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:5000"], // Allow local frontend + Postman
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow all necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true
}));

// ✅ Logging middleware (should be before routes & static files)
app.use((req, res, next) => {
    console.log(`📌 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve Static Files (Make sure 'public' folder exists)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Import & Use Routes
app.use("/api", require("./routes/authRoutes"));   //Signup and Signin
app.use("/api", require("./routes/profileRoutes")); // Profile
app.use("/api", require("./routes/nutritionistRoutes")); // Nutritionist
app.use("/api", require("./routes/consultationRoutes")); // booking

// ✅ Default Route (Optional)
app.get("/", (req, res) => {
    res.send("✅ Nutri Connect Server is Running...");
});

// ✅ Catch-all Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
