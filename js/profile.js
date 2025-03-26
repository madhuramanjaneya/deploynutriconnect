document.addEventListener("DOMContentLoaded", function () {
    const profileForm = document.getElementById("profileForm");

    profileForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const age = document.getElementById("age").value;
        const weight = document.getElementById("weight").value;
        const height = document.getElementById("height").value;
        const languages = Array.from(document.getElementById("languages").selectedOptions).map(opt => opt.value).join(",");
        const healthConditions = Array.from(document.getElementById("healthConditions").selectedOptions).map(opt => opt.value).join(",");
        const healthGoals = document.getElementById("healthGoals").value;
        const dietaryPreferences = document.getElementById("dietaryPreferences").value;
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

        try {
            const response = await fetch("http://localhost:5000/api/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                alert("Profile saved successfully!");
                window.location.href = "login.html";
            } else {
                alert("Error saving profile.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
