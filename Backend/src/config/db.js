// db.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Yugabyte Cloud requires SSL but allows without cert
  },
});

// Test connection
pool.connect()
  .then(client => {
    console.log("✅ Connected to Yugabyte/Postgres Database");
    client.release();
  })
  .catch(err => console.error("❌ Database connection error:", err.stack));

export default pool;
