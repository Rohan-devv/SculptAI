import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./src/config/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ status: "ok", time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
