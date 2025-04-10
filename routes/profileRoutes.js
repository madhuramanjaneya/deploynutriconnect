const express = require("express");
const router = express.Router();
const pool = require("../db");
const {
    getUserProfile,
    updateUserProfile,
    saveUserProfile,
    deleteUserProfile
  } = require("../controllers/profileController");

router.get("/userprofile/:id", getUserProfile);
router.put("/userprofile/:id", updateUserProfile);
router.delete("/userprofile/:id", deleteUserProfile);
router.post("/profile", saveUserProfile);
module.exports = router;
