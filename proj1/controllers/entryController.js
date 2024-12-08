const { Pool } = require("pg");
const pool = new Pool({
  user: "doadmin",
  host: "db-postgresql-fra1-09218-do-user-18185042-0.h.db.ondigitalocean.com",
  database: "defaultdb",
  password: "AVNS_3WIVCRis9PWjAZLWTz4hide",
  port: 25060,
  ssl: {
    rejectUnauthorized: false,
  },
});

exports.createEntry = async (req, res) => {
  const { title, content } = req.body;

  try {
    const query =
      "INSERT INTO entries (title, content) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(query, [title, content]);

    res.status(201).json({
      message: "Entry created successfully",
      entry: result.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create entry" });
  }
};

exports.getEntries = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM entries");
    res.status(200).json(result.rows); // Возвращаем все записи
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
};

exports.updateEntry = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const entryQuery = "SELECT * FROM entries WHERE id = $1";
    const entryResult = await pool.query(entryQuery, [id]);

    if (entryResult.rows.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }

    const updateQuery =
      "UPDATE entries SET title = $1, content = $2 WHERE id = $3 RETURNING *";
    const updateResult = await pool.query(updateQuery, [title, content, id]);

    res.json({
      message: "Entry updated successfully",
      entry: updateResult.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to update entry" });
  }
};

exports.deleteEntry = async (req, res) => {
  const { id } = req.params;

  try {
    const entryQuery = "SELECT * FROM entries WHERE id = $1";
    const entryResult = await pool.query(entryQuery, [id]);

    if (entryResult.rows.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }

    const deleteQuery = "DELETE FROM entries WHERE id = $1 RETURNING *";
    const deleteResult = await pool.query(deleteQuery, [id]);

    res.json({
      message: "Entry deleted successfully",
      entry: deleteResult.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to delete entry" });
  }
};

exports.toggleFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    const entryQuery = "SELECT * FROM entries WHERE id = $1";
    const entryResult = await pool.query(entryQuery, [id]);

    if (entryResult.rows.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }

    const currentFavoriteStatus = entryResult.rows[0].isfavorite;
    const newFavoriteStatus = !currentFavoriteStatus;

    const updateQuery =
      "UPDATE entries SET isfavorite = $1 WHERE id = $2 RETURNING *";
    const updateResult = await pool.query(updateQuery, [newFavoriteStatus, id]);

    res.json({
      message: "Favorite status updated",
      isFavorite: updateResult.rows[0].isfavorite,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to update favorite status" });
  }
};

exports.deleteImage = async (req, res) => {
  const { id, imageId } = req.params;

  try {
    const entryQuery = "SELECT * FROM entries WHERE id = $1";
    const entryResult = await pool.query(entryQuery, [id]);

    if (entryResult.rows.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }

    const deleteImageQuery =
      "DELETE FROM images WHERE id = $1 AND entry_id = $2 RETURNING *";
    const deleteImageResult = await pool.query(deleteImageQuery, [imageId, id]);

    if (deleteImageResult.rows.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json({
      message: "Image deleted successfully",
      image: deleteImageResult.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to delete image" });
  }
};
