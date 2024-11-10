// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "./public")));

app.use("/api", require("./router"));

// Listens when and what port opens
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
