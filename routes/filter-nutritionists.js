const express = require("express");
const router = express.Router();
const db = require("../db"); // Database connection

// ✅ Route to filter nutritionists based on user input
router.post("/nutritionists/filter", async (req, res) => {
    try {
        const { language, specialization, experience } = req.body;

        let query = "SELECT * FROM nutritionists WHERE 1=1";
        let queryParams = [];

        if (language) {
            query += " AND languages LIKE ?";
            queryParams.push(`%${language}%`);
        }

        if (specialization) {
            query += " AND specialization LIKE ?";
            queryParams.push(`%${specialization}%`);
        }

        if (experience) {
            query += " AND experience >= ?";
            queryParams.push(parseInt(experience, 10));
        }

        console.log("🔹 Executing filter query:", query, queryParams);

        const [filteredNutritionists] = await db.execute(query, queryParams);

        console.log(`✅ Found ${filteredNutritionists.length} matching nutritionists`);

        res.status(200).json({ nutritionists: filteredNutritionists });

    } catch (error) {
        console.error("🔥 Error filtering nutritionists:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
