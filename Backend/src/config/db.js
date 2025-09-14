import fs from "fs";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log(
  "DATABASE_URL (masked):",
  process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace(/(\/\/[^:]+:).+(@)/, "$1*****$2")
    : undefined
);

const buildSsl = () => {
  if (process.env.SSL_ROOT_CERT) {
    try {
      const ca = fs.readFileSync(process.env.SSL_ROOT_CERT).toString();
      return { rejectUnauthorized: true, ca };
    } catch (err) {
      console.error("⚠️ Failed to read SSL_ROOT_CERT:", err.message);
      // fallback for quick testing only:
      return { rejectUnauthorized: false };
    }
  }
  // no root cert provided -> allow self-signed (temporary)
  return { rejectUnauthorized: false };
};

const connectionOptions = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: buildSsl() }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      ssl: buildSsl(),
    };

const pool = new pg.Pool(connectionOptions);

pool.connect()
  .then(() => console.log("✅ Connected to DB"))
  .catch(err => console.error("❌ DB connection error:", err));

export default pool;
