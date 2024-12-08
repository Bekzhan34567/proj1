const sequelize = require("./config/database");

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection to DigitalOcean PostgreSQL is successful!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  });
