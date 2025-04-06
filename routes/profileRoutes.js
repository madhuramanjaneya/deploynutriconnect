const express = require("express");
const router = express.Router();
const pool = require("../js/db");
const { getUserProfile } = require("../controllers/profileController");
const { updateUserProfile } = require("../controllers/profileController");

// Save user profile (using callbacks for mysql)
router.post("/profile", (req, res) => {
    const {
        age,
        weight,
        height,
        languages,
        health_conditions,
        health_goals,
        dietary_preferences,
        location
    } = req.body;

    if (!age || !weight || !height || !health_goals || !dietary_preferences) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `
        INSERT INTO userprofile 
        (age, weight, height, languages, health_conditions, health_goals, dietary_preferences, location) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    pool.query(sql, [
        age,
        weight,
        height,
        languages,
        health_conditions,
        health_goals,
        dietary_preferences,
        location
    ], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(201).json({ message: "✅ Profile saved successfully" });
    });
});

router.get("/userprofile/:id", getUserProfile);
router.put("/userprofile/:id", updateUserProfile);

module.exports = router;
