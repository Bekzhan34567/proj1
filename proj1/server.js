require("dotenv").config({ path: "data.env" });

const express = require("express");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const entryRoutes = require("./routes/entryRoutes");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend")));

app.use("/users", userRoutes);
app.use("/entries", entryRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
