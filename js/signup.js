document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signupForm");
    const btn = document.querySelector(".signup-btn");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); 

        btn.disabled = true;

        let fullname = document.getElementById("fullname").value.trim();
        let email = document.getElementById("email").value.trim().toLowerCase(); // Always store emails in lowercase
        let password = document.getElementById("password").value.trim();
        let confirmPassword = document.getElementById("confirm-password").value.trim();

        let errors = [];
        if (fullname.length < 3) errors.push("Full Name must be at least 3 characters long.");
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) errors.push("Invalid email.");
        if (password.length < 6) errors.push("Password must be at least 6 characters long.");
        if (password !== confirmPassword) errors.push("Passwords do not match.");

        let errorBox = document.querySelector(".error-messages");
        if (!errorBox) {
            errorBox = document.createElement("div");
            errorBox.classList.add("error-messages");
            document.querySelector(".form-box").insertBefore(errorBox, form);
        }
        errorBox.innerHTML = "";

        if (errors.length > 0) {
            errors.forEach(msg => {
                let p = document.createElement("p");
                p.textContent = msg;
                p.style.color = "red";
                errorBox.appendChild(p);
            });
            btn.disabled = false;
            return;
        }

        console.log("🔄 Submitting signup form...");

        try {
            const response = await fetch('http://localhost:5000/api/signup', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: fullname, email: email, password: password })
            });

            const data = await response.json();
            console.log("🔹 Server Response:", data);

            if (response.ok) {
                alert(data.message);
                
                // Store user details in sessionStorage (Same as login)
                sessionStorage.setItem("user", JSON.stringify(data.user));

                window.location.href = "profile.html"; 
            } else {
                let p = document.createElement("p");
                p.textContent = data.message;
                p.style.color = "red";
                errorBox.appendChild(p);
            }
        } catch (error) {
            console.error("❌ Fetch Error:", error);
            let p = document.createElement("p");
            p.textContent = "Something went wrong. Please try again.";
            p.style.color = "red";
            errorBox.appendChild(p);
        } finally {
            btn.disabled = false;
        }
    });
});
