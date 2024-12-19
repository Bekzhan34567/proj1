const { Pool } = require("pg");
const fs = require("fs").promises;

const pool = new Pool({
  user: "doadmin",
  host: "db-postgresql-fra1-09218-do-user-18185042-0.h.db.ondigitalocean.com",
  database: "defaultdb",
  password: "AVNS_3WIVCRis9PWjAZLWTz4",
  port: 25060,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Вспомогательная функция для проверки существования записи
async function findEntryById(id) {
  const result = await pool.query("SELECT * FROM entries WHERE id = $1", [id]);
  return result.rows[0];
}

exports.createEntry = async (req, res) => {
  const { title, content } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO entries (title, content, isfavorite) VALUES ($1, $2, $3) RETURNING *",
      [title, content, false]
    );
    res.status(201).json({
      message: "Entry created successfully",
      entry: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating entry:", error);
    res.status(500).json({ error: "Failed to create entry" });
  }
};

// Получение всех записей
exports.getEntries = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM entries");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching entries:", error.stack);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
};

// Обновление записи
exports.updateEntry = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const entry = await findEntryById(id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    const result = await pool.query(
      "UPDATE entries SET title = $1, content = $2 WHERE id = $3 RETURNING *",
      [title, content, id]
    );

    res.json({
      message: "Entry updated successfully",
      entry: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating entry:", error.stack);
    res.status(500).json({ error: "Failed to update entry" });
  }
};

// Удаление записи
exports.deleteEntry = async (req, res) => {
  const { id } = req.params;

  try {
    const entry = await findEntryById(id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    await pool.query("DELETE FROM entries WHERE id = $1", [id]);
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting entry:", error.stack);
    res.status(500).json({ error: "Failed to delete entry" });
  }
};

// Переключение статуса "избранное"
exports.toggleFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    const entry = await findEntryById(id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    const result = await pool.query(
      "UPDATE entries SET isfavorite = NOT isfavorite WHERE id = $1 RETURNING *",
      [id]
    );

    res.json({
      message: "Favorite status updated",
      entry: result.rows[0],
    });
  } catch (error) {
    console.error("Error toggling favorite status:", error.stack);
    res.status(500).json({ error: "Failed to toggle favorite status" });
  }
};

// Удаление изображения
exports.deleteImage = async (req, res) => {
  const { id, imageId } = req.params;

  try {
    const entry = await findEntryById(id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    const result = await pool.query(
      "DELETE FROM images WHERE id = $1 AND entry_id = $2 RETURNING *",
      [imageId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    const imagePath = result.rows[0].path;
    await fs.unlink(`.${imagePath}`);

    res.json({
      message: "Image deleted successfully",
      image: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting image:", error.stack);
    res.status(500).json({ error: "Failed to delete image" });
  }
};
