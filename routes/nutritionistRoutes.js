const express = require("express");
const router = express.Router();
const {
  filterNutritionists,
  getNutritionistsBasedOnUserProfile
} = require("../controllers/nutritionistController");

// Route: GET nutritionists based on user profile (languages + health_goals)
router.get("/nutritionists", getNutritionistsBasedOnUserProfile);

// Route: POST filter nutritionists manually
router.post("/nutritionists/filter", filterNutritionists);

module.exports = router;
