const { Client } = require("pg");

const client = new Client({
  host: "db-postgresql-fra1-09218-do-user-18185042-0.h.db.ondigitalocean.com",
  port: 25060,
  user: "doadmin",
  password: "AVNS_3WIVCRis9PWjAZLWTz4",
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: false,
  },
});

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

module.exports = client;
