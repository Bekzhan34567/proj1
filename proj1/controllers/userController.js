const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const client = require("../models/db");

const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";
    const values = [username, email, hashedPassword];

    const result = await client.query(query, values);
    const newUser = result.rows[0];

    res.status(201).json({ message: "User registered", userId: newUser.id });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await client.query(query, [email]);

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Генерация JWT токена
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(400).json({ error: err.message });
  }
};
