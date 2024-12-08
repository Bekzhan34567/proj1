const { Client } = require("pg");

const client = require("./db");

const createUser = async (username, email, password) => {
  try {
    const query =
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";
    const values = [username, email, password];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error creating user: " + error.message);
  }
};

const getUserByEmail = async (email) => {
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await client.query(query, [email]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};

module.exports = { createUser, getUserByEmail };
