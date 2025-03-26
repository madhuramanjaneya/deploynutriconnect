const express = require("express");
const db = require("../js/db"); // ✅ Import db.js

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const emailLower = email.toLowerCase();

        // Check if email already exists
        const [existingUsers] = await db.execute("SELECT * FROM users WHERE email = ?", [emailLower]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Email already exists. Please use a different one." });
        }

        // Insert new user
        const insertQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        const [result] = await db.execute(insertQuery, [name, emailLower, password]);

        console.log("✅ User successfully added:", result);

        // Fetch the newly created user
        const [newUser] = await db.execute("SELECT * FROM users WHERE email = ?", [emailLower]);

        return res.status(201).json({ 
            message: "User signed up successfully!", 
            user: newUser[0] // Send user object for frontend session storage
        });

    } catch (error) {
        console.error("🔥 Signup Error:", error);
        return res.status(500).json({ message: "Internal Server Error!" });
    }
});

module.exports = router;
