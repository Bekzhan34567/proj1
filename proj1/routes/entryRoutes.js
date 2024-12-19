const express = require("express");
const {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry,
  toggleFavorite,
  deleteImage,
} = require("../controllers/entryController");
const { uploadImage } = require("../middleware/imageUpload");

const router = express.Router();

// Маршруты
router.post("/", createEntry);
router.get("/", getEntries);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);
router.put("/:id/favorite", toggleFavorite);
router.post("/:id/images", uploadImage);
router.delete("/:id/images/:imageId", deleteImage);

module.exports = router;
