import "dotenv/config";
import fs from "fs";
import { pool } from "../config/db.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
(async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    console.log("Applying schema...");
    await pool.query(sql);
    console.log("Schema applied successfully.");
  } catch (error) {
    console.error("Failed to apply schema: ", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
