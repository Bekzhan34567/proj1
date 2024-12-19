const multer = require("multer");
const path = require("path");
const { Pool } = require("pg"); // Для работы с базой данных

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

// Настройки хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Укажите папку для хранения изображений
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

exports.uploadImage = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { id } = req.params;

    try {
      // Проверка существования записи в базе данных
      const entryQuery = "SELECT * FROM entries WHERE id = $1";
      const entryResult = await pool.query(entryQuery, [id]);

      if (entryResult.rows.length === 0) {
        return res.status(404).json({ message: "Entry not found" });
      }

      // Сохраняем путь к изображению в базе данных
      const imagePath = `/uploads/${req.file.filename}`;
      const insertQuery =
        "INSERT INTO images (entry_id, path) VALUES ($1, $2) RETURNING *";
      const imageResult = await pool.query(insertQuery, [id, imagePath]);

      res.status(201).json({
        message: "Image uploaded successfully",
        image: imageResult.rows[0],
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
};
