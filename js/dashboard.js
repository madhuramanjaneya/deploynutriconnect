document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 Dashboard Loaded");

    // ✅ Get user data from sessionStorage
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user) {
        alert("Unauthorized! Please log in first.");
        window.location.href = "login.html";
        return;
    }

    // ✅ Display user info correctly
    document.getElementById("userName").textContent = user.name || "N/A";
    document.getElementById("userAge").textContent = user.age || "N/A";
    document.getElementById("userWeight").textContent = user.weight || "N/A";
    document.getElementById("userHeight").textContent = user.height || "N/A";
    document.getElementById("userGoal").textContent = user.health_goals || "N/A"; 

    // ✅ Function to fetch all nutritionists
    function fetchAllNutritionists() {
        fetch(`http://localhost:5000/api/nutritionists?userId=${user.id}`)
            .then(response => response.json())
            .then(data => {
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
                    `;
                    container.appendChild(card);
                });
            })
            .catch(error => console.error("❌ Error fetching nutritionists:", error));
    }

    // ✅ Fetch all nutritionists on page load
    fetchAllNutritionists();

    // ✅ Apply Filters Button Click
    document.getElementById("applyFilters").addEventListener("click", function () {
        const language = document.getElementById("languageFilter").value;
        const specialization = document.getElementById("specializationFilter").value;
        const experience = document.getElementById("experienceFilter").value;

        const filters = { language, specialization, experience };

        fetch("http://localhost:5000/api/nutritionists/filter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filters),
        })
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("filteredNutritionistsContainer");
            container.innerHTML = ""; // Clear previous results
            
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
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error("❌ Error fetching filtered nutritionists:", error));
    });

    // ✅ Reset Filters Button Click
    document.getElementById("resetFilters").addEventListener("click", function () {
        // ✅ Clear filter input values
        document.getElementById("languageFilter").value = "";
        document.getElementById("specializationFilter").value = "";
        document.getElementById("experienceFilter").value = "";

        // ✅ Clear filtered nutritionists container
        document.getElementById("filteredNutritionistsContainer").innerHTML = "";

        // ✅ Fetch all nutritionists again
        fetchAllNutritionists();
    });

    // ✅ Logout
    document.getElementById("logout").addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "login.html";
    });
});
