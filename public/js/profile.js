document.addEventListener("DOMContentLoaded", async function () {
    const profileForm = document.getElementById("profileForm");
    const isUpdating = localStorage.getItem("isUpdatingProfile") === "true";

    if (isUpdating) {
        try {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                alert("User ID not found in session. Please log in again.");
                window.location.href = "login.html";
                return;
            }

            const BASE_URL = window.location.origin.includes("localhost")
                ? "http://localhost:5000"
                : "https://deploynutriconnect.onrender.com";

            const response = await fetch(`${BASE_URL}/api/userprofile/${userId}`, {
                method: "GET"
            });

            if (response.ok) {
                const data = await response.json();

                document.getElementById("age").value = data.age || "";
                document.getElementById("weight").value = data.weight || "";
                document.getElementById("height").value = data.height || "";

                const languages = data.languages ? data.languages.split(",") : [];
                Array.from(document.getElementById("languages").options).forEach(option => {
                    option.selected = languages.includes(option.text);
                });

                const conditions = data.health_conditions ? data.health_conditions.split(",") : [];
                Array.from(document.getElementById("healthConditions").options).forEach(option => {
                    option.selected = conditions.includes(option.text);
                });

                // Match the display text, not value
                Array.from(document.getElementById("healthGoals").options).forEach(option => {
                    if (option.text === data.health_goals) option.selected = true;
                });

                Array.from(document.getElementById("dietaryPreferences").options).forEach(option => {
                    if (option.text === data.dietary_preferences) option.selected = true;
                });

                document.getElementById("location").value = data.location || "";
            } else {
                alert("Error fetching profile data.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while loading profile data.");
        }
    }

    profileForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const age = document.getElementById("age").value;
        const weight = document.getElementById("weight").value;
        const height = document.getElementById("height").value;

        const languages = Array.from(document.getElementById("languages").selectedOptions)
            .map(opt => opt.text).join(",");

        const healthConditions = Array.from(document.getElementById("healthConditions").selectedOptions)
            .map(opt => opt.text).join(",");

        const healthGoals = document.getElementById("healthGoals").selectedOptions[0].text;
        const dietaryPreferences = document.getElementById("dietaryPreferences").selectedOptions[0].text;
        const location = document.getElementById("location").value;

        if (!age || !weight || !height || !healthGoals || !dietaryPreferences) {
            alert("Please fill in all required fields.");
            return;
        }

        const profileData = {
            age,
            weight,
            height,
            languages,
            health_conditions: healthConditions,
            health_goals: healthGoals,
            dietary_preferences: dietaryPreferences,
            location
        };

        const BASE_URL = window.location.origin.includes("localhost")
            ? "http://localhost:5000"
            : "https://deploynutriconnect.onrender.com";

        try {
            const userId = localStorage.getItem("userId");

            const url = isUpdating
                ? `${BASE_URL}/api/userprofile/${userId}`
                : `${BASE_URL}/api/profile`;

            const method = isUpdating ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                alert("Profile saved successfully!");
                localStorage.removeItem("isUpdatingProfile");

                window.location.href = isUpdating ? "dashboard.html" : "login.html";
            } else {
                alert("Error saving profile.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
