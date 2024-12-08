const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, getUserByEmail } = require("../models/User"); // Импортируем функции для работы с пользователями

const jwtSecret = process.env.JWT_SECRET;

// Регистрация пользователя
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Используем функцию для создания пользователя в базе данных
    const newUser = await createUser(username, email, hashedPassword);

    res.status(201).json({ message: "User registered", userId: newUser.id });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(400).json({ error: err.message });
  }
};

// Логин пользователя
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Используем функцию для получения пользователя по email
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Сравниваем пароль с хэшированным
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
