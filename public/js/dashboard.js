document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 Dashboard Loaded");
  
    const BASE_URL = window.location.origin.includes("localhost")
      ? "http://localhost:5000"
      : "https://deploynutriconnect.onrender.com";
  
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (!user) {
      alert("Unauthorized! Please log in first.");
      window.location.href = "login.html";
      return;
    }
    
  
    async function fetchUserProfile() {
      try {
        const response = await fetch(`${BASE_URL}/api/userprofile/${user.id}`);
        const profile = await response.json();
  
        document.getElementById("userName").textContent = user.name || "N/A";
        document.getElementById("userAge").textContent = profile.age || "N/A";
        document.getElementById("userWeight").textContent = profile.weight || "N/A";
        document.getElementById("userHeight").textContent = profile.height || "N/A";
        document.getElementById("userGoal").textContent = profile.health_goals || "N/A";
      } catch (err) {
        console.error("Error fetching user profile:", err);
        alert("Failed to load profile details.");
      }
    }
  
    async function fetchAllNutritionists() {
      try {
        const response = await fetch(`${BASE_URL}/api/nutritionists?userId=${user.id}`);
        const data = await response.json();
  
        const container = document.getElementById("nutritionistsContainer");
        container.innerHTML = "";
  
        if (!data.nutritionists || data.nutritionists.length === 0) {
          container.innerHTML = "<p>No matching nutritionists found.</p>";
          return;
        }
  
        data.nutritionists.forEach(nutritionist => {
          const card = document.createElement("div");
          card.classList.add("nutritionist-card");
          card.innerHTML = `
            <h3>${nutritionist.name}</h3>
            <p><strong>Experience:</strong> ${nutritionist.experience} years</p>
            <p><strong>Languages:</strong> ${nutritionist.languages}</p>
            <p><strong>Specialization:</strong> ${nutritionist.specialization}</p>
            <p><strong>Location:</strong> ${nutritionist.location}</p>
            <p><strong>Contact:</strong> ${nutritionist.contact}</p>
            <button class="book-btn" onclick="openConsultationForm(${nutritionist.id})">Book Consultation</button>
          `;
          container.appendChild(card);
        });
      } catch (error) {
        console.error("❌ Error fetching nutritionists:", error);
      }
    }
  
    async function applyFilters() {
      const language = document.getElementById("languageFilter").value;
      const specialization = document.getElementById("specializationFilter").value;
      const experience = document.getElementById("experienceFilter").value;
  
      const filters = { language, specialization, experience };
  
      try {
        const response = await fetch(`${BASE_URL}/api/nutritionists/filter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filters),
        });
  
        const data = await response.json();
        const container = document.getElementById("filteredNutritionistsContainer");
        container.innerHTML = "";
  
        if (!data.nutritionists || data.nutritionists.length === 0) {
          container.innerHTML = "<p>No nutritionists found with the selected filters.</p>";
          return;
        }
  
        data.nutritionists.forEach(nutritionist => {
          const card = document.createElement("div");
          card.classList.add("nutritionist-card");
          card.innerHTML = `
            <h3>${nutritionist.name}</h3>
            <p><strong>Experience:</strong> ${nutritionist.experience} years</p>
            <p><strong>Languages:</strong> ${nutritionist.languages}</p>
            <p><strong>Specialization:</strong> ${nutritionist.specialization}</p>
            <p><strong>Location:</strong> ${nutritionist.location}</p>
            <p><strong>Contact:</strong> ${nutritionist.contact}</p>
            <button class="book-btn" onclick="openConsultationForm(${nutritionist.id})">Book Consultation</button>
          `;
          container.appendChild(card);
        });
      } catch (error) {
        console.error("❌ Error fetching filtered nutritionists:", error);
      }
    }
  
    async function deleteProfile() {
      const userId = localStorage.getItem("userId");
      if (userId && confirm("Are you sure you want to delete your profile?")) {
        try {
          const response = await fetch(`${BASE_URL}/api/userprofile/${userId}`, {
            method: "DELETE",
          });
  
          if (response.ok) {
            alert("Profile deleted successfully.");
            localStorage.clear();
            window.location.href = "/index.html";
          } else {
            alert("Failed to delete profile.");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Something went wrong.");
        }
      }
    }
  
    document.getElementById("applyFilters").addEventListener("click", applyFilters);
  
    document.getElementById("resetFilters").addEventListener("click", () => {
      document.getElementById("languageFilter").value = "";
      document.getElementById("specializationFilter").value = "";
      document.getElementById("experienceFilter").value = "";
      document.getElementById("filteredNutritionistsContainer").innerHTML = "";
      fetchAllNutritionists();
    });
  
    document.getElementById("updateDetails").addEventListener("click", () => {
      if (user && user.id) {
        localStorage.setItem("userId", user.id);
        localStorage.setItem("isUpdatingProfile", "true");
      }
      window.location.href = "profile.html";
    });
  
    document.getElementById("deleteProfileBtn").addEventListener("click", deleteProfile);
  
    document.getElementById("logout").addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  
    fetchUserProfile();
    fetchAllNutritionists();
  });
  
  // Modal functions
  function openConsultationForm(nutritionistId) {
    const modal = document.getElementById("appointmentModal");
    document.getElementById("consultationForm").reset();
    document.getElementById("nutritionistIdInput").value = nutritionistId;
    modal.style.display = "flex";
  }
  
  function closeConsultationForm() {
    const modal = document.getElementById("appointmentModal");
    document.getElementById("consultationForm").reset();
    modal.style.display = "none";
  }
  
  window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("appointmentModal").style.display = "none";
  });
  