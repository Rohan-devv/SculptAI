import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./src/config/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --------------------
// Health Check
// --------------------
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Create users table
// --------------------
app.get("/api/create-table", async (req, res) => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        email VARCHAR(50) UNIQUE NOT NULL
      )
    `;
    await pool.query(query);
    res.send("✅ Table 'users' created successfully!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Insert a new user
// --------------------
app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const query = `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [name, email]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Get all users
// --------------------
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Get single user by id
// --------------------
app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Update user by id
// --------------------
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const query = `
      UPDATE users
      SET name = $1, email = $2
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [name, email, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Delete user by id
// --------------------


// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
