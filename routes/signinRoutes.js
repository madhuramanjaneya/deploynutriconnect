const express = require("express");
const router = express.Router();
const db = require("../js/db"); // ✅ Correct path

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("🟡 Received login request for:", email);

        // Step 1: Verify user credentials
        const userQuery = "SELECT * FROM users WHERE email = ? AND password = ?";
        console.log("🟡 Executing query:", userQuery, [email, password]);

        const [users] = await db.execute(userQuery, [email, password]);

        if (users.length === 0) {
            console.log("❌ Invalid login attempt for email:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = users[0];

        // Step 2: Fetch user profile details
        const profileQuery = "SELECT * FROM userprofile WHERE id = ?";
        console.log("🟡 Fetching user profile:", profileQuery, [user.id]);

        const [profile] = await db.execute(profileQuery, [user.id]);

        // Merge user details and profile details
        const userDetails = {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            ...profile[0], // Spreads profile details if available
        };

        console.log("✅ Login successful for:", email);
        res.status(200).json({ user: userDetails });

    } catch (error) {
        console.error("🔥 Error during sign-in:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
