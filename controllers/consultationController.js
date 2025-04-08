// controllers/consultationController.js
const db = require("../js/db");

// Book a consultation
const bookConsultation = async (req, res) => {
  const { user_id, nutritionist_id, date, time } = req.body;

  try {
    // Check if slot is already booked
    const [existing] = await db.query(
      "SELECT * FROM appointments WHERE nutritionist_id = ? AND date = ? AND time = ?",
      [nutritionist_id, date, time]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // Insert new appointment
    await db.query(
      "INSERT INTO appointments (user_id, nutritionist_id, date, time) VALUES (?, ?, ?, ?)",
      [user_id, nutritionist_id, date, time]
    );

    res.status(201).json({ message: "Consultation booked successfully" });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all appointments for a user
const getUserAppointments = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [appointments] = await db.query(
      `SELECT a.id, a.date, a.time, n.name AS nutritionist_name
       FROM appointments a
       JOIN nutritionists n ON a.nutritionist_id = n.id
       WHERE a.user_id = ?
       ORDER BY a.date, a.time`,
      [userId]
    );

    res.json(appointments);
  } catch (error) {
    console.error("Fetching appointments error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    await db.query("DELETE FROM appointments WHERE id = ?", [appointmentId]);
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Deleting error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  bookConsultation,
  getUserAppointments,
  deleteAppointment,
};
