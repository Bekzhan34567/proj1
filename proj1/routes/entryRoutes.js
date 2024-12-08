const express = require("express");
const {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry,
  toggleFavorite,
  deleteImage,
} = require("../controllers/entryController");

const router = express.Router();

router.post("/", createEntry);
router.get("/", getEntries);
router.put("/:id", updateEntry);
router.delete("/:id", deleteEntry);
router.put("/:id/favorite", toggleFavorite);
router.delete("/:id/images/:imageId", deleteImage);

module.exports = router;
