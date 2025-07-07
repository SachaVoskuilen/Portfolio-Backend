import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import pool from "@database";
import { loadLanguages } from "@helpers/index";
import { readdir, readFile } from "fs/promises";

dotenv.config();

const app: Express = express();
const port = process.env.EXPRESS_PORT || 3000;

export const corsOptions: cors.CorsOptions = {
  origin: process.env.ALLOWED_ORIGINS!.split(" "),
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

async function main() {
  try {
    await dbInit();
    await loadLanguages();
    app.use(express.static(path.join(__dirname, "./public")));
    app.use("/api", require("./router"));
    // Listens when and what port opens
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Error during app startup:", err);
    process.exit(1);
  }
}

async function dbInit() {
  const client = await pool.connect();

  try {
    // await client.query(
    // `CREATE TABLE users(
    //   user_id SERIAL PRIMARY KEY,
    //   username varchar(25) UNIQUE NOT NULL,
    //   email varchar(50) UNIQUE NOT NULL,
    //   password varchar(60) NOT NULL
    // );`);

    console.log("⏳ Dropping existing tables...");
    await client.query(`DROP TABLE IF EXISTS about_me_entry_image CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS about_me_image CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS about_me_entry CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS about_me_group CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS project_entry_image CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS project_image CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS project_entry CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS project_group CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS language CASCADE;`);

    console.log("⏳ Running database migrations...");
    const migrationsDirPath = path.join(__dirname, "database", "migrations");
    const migrationFiles = await readdir(migrationsDirPath);
    const sortedMigrationFiles = migrationFiles.sort();

    for (const file of sortedMigrationFiles) {
      if (file.endsWith(".sql")) {
        const filePath = path.join(migrationsDirPath, file);
        const sql = await readFile(filePath, "utf8");
        await client.query(sql);
        console.log(`✅ Executed migration: ${file}`);
      }
    }
    console.log("✅ Database migrations complete!");

    console.log("⏳ Inserting seed data...");
    const seedersDirPath = path.join(__dirname, "database", "seeders");
    const seederFiles = await readdir(seedersDirPath);
    const sortedSeederFiles = seederFiles.sort();

    for (const file of sortedSeederFiles) {
      if (file.endsWith(".sql")) {
        const filePath = path.join(seedersDirPath, file);
        const sql = await readFile(filePath, "utf8");
        await client.query(sql);
        console.log(`✅ Executed seeder: ${file}`);
      }
    }

    console.log("🎉 Database setup complete!");
  } catch (err) {
    console.error("❌ Error setting up the database:", err);
  } finally {
    await client.release();
  }
}

main();
