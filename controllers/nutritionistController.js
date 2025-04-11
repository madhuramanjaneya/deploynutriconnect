const db = require("../db"); // DB connection

// 🔹 Filter nutritionists manually using user input
const filterNutritionists = async (req, res) => {
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
};

// 🔹 Get nutritionists based on user profile (language + health_goals)
const getNutritionistsBasedOnUserProfile = async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    console.log(`🟡 Fetching user profile for userId: ${userId}`);

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

    const languageList = languages ? languages.split(",") : [];
    const healthGoalList = health_goals ? health_goals.split(",") : [];

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

    const [nutritionists] = await db.execute(query, queryParams);

    console.log(`✅ Found ${nutritionists.length} matching nutritionists`);

    res.status(200).json({ nutritionists });

  } catch (error) {
    console.error("🔥 Error fetching nutritionists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  filterNutritionists,
  getNutritionistsBasedOnUserProfile
};
