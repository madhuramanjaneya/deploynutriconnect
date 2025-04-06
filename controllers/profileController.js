const db = require("../js/db");

//Get profile

const getUserProfile = async (req, res) => {
    const userId = req.params.id;
    console.log("Fetching profile for ID:", userId);

    try {
        const [results] = await db.query("SELECT * FROM userprofile WHERE id = ?", [userId]);

        if (results.length === 0) {
            return res.status(404).json({ message: "User profile not found" });
        }

        res.status(200).json(results[0]);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

//Update profile 

const updateUserProfile = async (req, res) => {
    const userId = req.params.id;
    const { age, weight, height, languages, health_conditions, health_goals, dietary_preferences, location } = req.body;

    try {
        const query = `
            UPDATE userprofile 
            SET age = ?, weight = ?, height = ?, languages = ?, health_conditions = ?, health_goals = ?, dietary_preferences = ?, location = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [
            age, weight, height, languages, health_conditions, health_goals, dietary_preferences, location, userId
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User profile not found" });
        }

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Save user profile
const saveUserProfile = async (req, res) => {
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

    // Check for missing required fields
    if (!age || !weight || !height || !health_goals || !dietary_preferences) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `
        INSERT INTO userprofile 
        (age, weight, height, languages, health_conditions, health_goals, dietary_preferences, location) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await db.query(sql, [
            age,
            weight,
            height,
            languages,
            health_conditions,
            health_goals,
            dietary_preferences,
            location
        ]);

        res.status(201).json({ message: "✅ Profile saved successfully" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

 
module.exports = { getUserProfile, updateUserProfile ,saveUserProfile};
