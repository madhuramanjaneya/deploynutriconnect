document.addEventListener("DOMContentLoaded", function () {
    console.log("Login Page Loaded ✅");

    const loginForm = document.getElementById("loginForm");
    const loginButton = document.getElementById("loginButton");

    if (!loginForm || !loginButton) {
        console.error("❌ loginForm or loginButton not found!");
        return;
    }

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); 

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        console.log("🔄 Attempting login with:", { email });

        if (!email || !password) {
            alert("⚠ Please enter both email and password.");
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log("🔹 Server Response:", data);

            if (data.user) {
                console.log("✅ Login Successful:", data.user);
            
                // Store full user object
                localStorage.setItem("user", JSON.stringify(data.user));
            
                // ✅ Store userId separately so other pages can use it
                localStorage.setItem("userId", data.user.id);
            
                window.location.href = "dashboard.html";
            } else {
                console.error("❌ Login Failed:", data.error);
                alert("Invalid email or password");
            }
            
        } catch (error) {
            console.error("❌ Fetch Error:", error);
            alert("⚠ Network error. Please try again.");
        }

        loginButton.disabled = false;
        loginButton.textContent = "Login";
    });
});
