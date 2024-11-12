// Import necessary modules using ES module syntax
import path from "path";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

// Load environment variables from .env file
dotenv.config({
  override: true,
  path: path.join(process.cwd(), ".env"),
});

// Create a new Pool instance with the environment variables
const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: Number(process.env.PORT),
});

// Export the pool instance for use in other modules
export default pool;
