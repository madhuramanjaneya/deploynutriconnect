const express = require("express");
const router = express.Router();
const pool = require("../js/db");
const { getUserProfile } = require("../controllers/profileController");
const { updateUserProfile } = require("../controllers/profileController");
const { saveUserProfile } = require("../controllers/profileController");


router.get("/userprofile/:id", getUserProfile);
router.put("/userprofile/:id", updateUserProfile);
router.post("/profile", saveUserProfile);
module.exports = router;
