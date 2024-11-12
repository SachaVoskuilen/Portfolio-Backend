// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import pool from "./database";

dotenv.config();

const app: Express = express();
const port = process.env.EXPRESS_PORT || 3000;

app.use(express.static(path.join(__dirname, "./public")));

app.use("/api", require("./router"));

// Listens when and what port opens
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// async function dbInit() {
//   const result = await pool.query(
//     "CREATE TABLE users( user_id SERIAL PRIMARY KEY, username varchar(25) UNIQUE NOT NULL, email varchar(50) UNIQUE NOT NULL, password varchar(60) NOT NULL);"
//   );
// }
// dbInit();
