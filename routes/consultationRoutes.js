 
const express = require("express");
const router = express.Router();
const {
  bookConsultation,
  getUserAppointments,
  deleteAppointment,
} = require("../controllers/consultationController");

router.post("/appointments", bookConsultation);
router.get("/appointments/:userId", getUserAppointments);
router.delete("/appointments/:id", deleteAppointment);

module.exports = router;
