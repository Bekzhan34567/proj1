require("dotenv").config({ path: "data.env" });
// require("dotenv").config();

const express = require("express");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const entryRoutes = require("./routes/entryRoutes");

const app = express();

// Middleware для обработки JSON
app.use(express.json());

// Статический маршрут для загруженных файлов
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Подключение маршрутов API
app.use("/users", userRoutes);
app.use("/entries", entryRoutes);

// Статический маршрут для фронтенда
app.use(express.static(path.join(__dirname, "frontend")));

// Обработка всех других маршрутов (для SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
