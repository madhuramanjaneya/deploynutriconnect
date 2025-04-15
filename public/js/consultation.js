document.getElementById("consultationForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // prevent page reload

  const userId = localStorage.getItem("userId");
  const nutritionistId = document.getElementById("nutritionistIdInput").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  // ✅ Check if user ID is present
  if (!userId) {
    alert("Session expired or not logged in. Please login again.");
    return;
  }

  const BASE_URL = window.location.origin.includes("localhost")
    ? "http://localhost:5000"
    : "https://deploynutriconnect.onrender.com";

  try {
    console.log("📌 Booking appointment with:");
    console.log({ user_id: userId, nutritionist_id: nutritionistId, date, time });

    const res = await fetch(`${BASE_URL}/api/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        nutritionist_id: nutritionistId,
        date,
        time,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Appointment booked successfully!");
      closeConsultationForm(); // Close modal
    } else {
      alert(data.message || "❌ Failed to book appointment.");
    }

  } catch (err) {
    console.error("🚨 Server error while booking:", err);
    alert("❌ Server error while booking appointment.");
  }
});
