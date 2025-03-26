const express = require("express");
const router = express.Router();
const pool = require("../js/db");

router.post("/profile", async (req, res) => {
    const { age, weight, height, languages, health_conditions, health_goals, dietary_preferences, location } = req.body;

    if (!age || !weight || !height || !health_goals || !dietary_preferences) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const sql = "INSERT INTO userprofile (age, weight, height, languages, health_conditions, health_goals, dietary_preferences, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        await pool.query(sql, [age, weight, height, languages, health_conditions, health_goals, dietary_preferences, location]);
        res.status(201).json({ message: "Profile saved successfully" });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
