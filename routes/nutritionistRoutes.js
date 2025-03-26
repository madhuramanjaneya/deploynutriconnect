const express = require("express");
const router = express.Router();
const db = require("../js/db"); // Database connection

// Route to fetch matching nutritionists
router.get("/nutritionists", async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        console.log(`🟡 Fetching user profile for userId: ${userId}`);

        // Fetch user preferences (languages and health_goals)
        const [userProfile] = await db.execute(
            "SELECT languages, health_goals FROM userprofile WHERE id = ?",
            [userId]
        );

        if (userProfile.length === 0) {
            console.log("❌ User profile not found.");
            return res.status(404).json({ error: "User profile not found" });
        }

        let { languages, health_goals } = userProfile[0];

        console.log("🟢 User preferences:", { languages, health_goals });

        // Convert comma-separated strings into an array (if applicable)
        const languageList = languages ? languages.split(",") : [];
        const healthGoalList = health_goals ? health_goals.split(",") : [];

        // Construct dynamic SQL query
        let query = "SELECT * FROM nutritionists WHERE 1=1";
        let queryParams = [];

        if (languageList.length > 0) {
            query += ` AND (${languageList.map(() => "languages LIKE ?").join(" OR ")})`;
            queryParams.push(...languageList.map(lang => `%${lang.trim()}%`));
        }

        if (healthGoalList.length > 0) {
            query += ` AND (${healthGoalList.map(() => "specialization LIKE ?").join(" OR ")})`;
            queryParams.push(...healthGoalList.map(goal => `%${goal.trim()}%`));
        }

        console.log("🔹 Executing query:", query, queryParams);

        // Fetch matching nutritionists based on languages and health goals
        const [nutritionists] = await db.execute(query, queryParams);

        console.log(`✅ Found ${nutritionists.length} matching nutritionists`);

        res.status(200).json({ nutritionists });

    } catch (error) {
        console.error("🔥 Error fetching nutritionists:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
