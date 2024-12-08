const multer = require("multer");
const path = require("path");
const Image = require("../models/Image");
const Entry = require("../models/Entry");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

exports.uploadImage = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    const { id } = req.params;

    try {
      const entry = await Entry.findByPk(id);
      if (!entry) return res.status(404).json({ message: "Entry not found" });

      const image = await Image.create({
        path: `/uploads/${req.file.filename}`,
        EntryId: entry.id,
      });

      res.status(201).json(image);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};
