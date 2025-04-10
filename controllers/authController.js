const db = require("../db"); // ✅ Import DB connection

// Signup Controller
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const emailLower = email.toLowerCase();

        // Check for existing user
        const [existingUsers] = await db.execute("SELECT * FROM users WHERE email = ?", [emailLower]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Email already exists. Please use a different one." });
        }

        // Insert new user
        const insertQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        const [result] = await db.execute(insertQuery, [name, emailLower, password]);

        const [newUser] = await db.execute("SELECT * FROM users WHERE email = ?", [emailLower]);

        return res.status(201).json({
            message: "User signed up successfully!",
            user: newUser[0]
        });

    } catch (error) {
        console.error("🔥 Signup Error:", error);
        return res.status(500).json({ message: "Internal Server Error!" });
    }
};

// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("🟡 Login attempt for:", email);

        const userQuery = "SELECT * FROM users WHERE email = ? AND password = ?";
        const [users] = await db.execute(userQuery, [email, password]);

        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = users[0];

        const profileQuery = "SELECT * FROM userprofile WHERE id = ?";
        const [profile] = await db.execute(profileQuery, [user.id]);

        const userDetails = {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            ...profile[0]
        };

        res.status(200).json({ user: userDetails });

    } catch (error) {
        console.error("🔥 Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
