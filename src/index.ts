import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import pool from "@database";
import { loadLanguages } from "@helpers/index";

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
    await client.query(`
      DROP TABLE IF EXISTS project_entry_image CASCADE;
      DROP TABLE IF EXISTS project_image CASCADE;
      DROP TABLE IF EXISTS project_entry CASCADE;
      DROP TABLE IF EXISTS project_group CASCADE;
      DROP TABLE IF EXISTS language CASCADE;
    `);

    console.log("✅ Creating tables...");
    await client.query(`
      CREATE TABLE language (
        language_id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        code VARCHAR(5) NOT NULL UNIQUE
      );

      CREATE TABLE project_group (
        project_group_id SERIAL PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        is_public BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE project_entry (
        project_entry_id SERIAL PRIMARY KEY,
        project_group_id INTEGER NOT NULL REFERENCES project_group(project_group_id) ON DELETE CASCADE,
        language_id INTEGER NOT NULL REFERENCES language(language_id),
        part INTEGER NOT NULL,
        title VARCHAR(100) NOT NULL,
        text TEXT NOT NULL,
        UNIQUE(project_group_id, language_id, part)
      );

      CREATE TABLE project_image (
        image_id SERIAL PRIMARY KEY,
        project_group_id INTEGER NOT NULL REFERENCES project_group(project_group_id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        alt_text TEXT,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE project_entry_image (
        project_entry_id INTEGER REFERENCES project_entry(project_entry_id) ON DELETE SET NULL,
        image_id INTEGER REFERENCES project_image(image_id) ON DELETE SET NULL,
        PRIMARY KEY (project_entry_id, image_id)
      );
    `);

    console.log("✅ Inserting example data...");
    await client.query(`
      INSERT INTO language (name, code) VALUES
        ('Nederlands', 'NL'),
        ('English', 'EN');

      INSERT INTO project_group (slug) VALUES
        ('portfolio-website');

      INSERT INTO project_entry (project_group_id, language_id, part, title, text) VALUES
        (1, 1, 1, 'Introductie', 'Welkom bij mijn portfolio.'),
        (1, 1, 2, 'Details', 'Gebouwd met PostgreSQL en Next.js.'),
        (1, 2, 1, 'Introduction', 'Welcome to my portfolio.'),
        (1, 2, 2, 'Details', 'Built with PostgreSQL and Next.js.');

      INSERT INTO project_image (project_group_id, image_url, alt_text, sort_order) VALUES
        (1, 'https://pixelz.cc/wp-content/uploads/2018/07/gorilla-uhd-4k-wallpaper.jpg', 'Homepage screenshot', 1),
        (1, 'https://wallpapercave.com/wp/wp4903057.jpg', 'Details page', 2);

      INSERT INTO project_entry_image (project_entry_id, image_id) VALUES
        (1, 1),  -- koppelt afbeelding 1 aan entry 1
        (2, 2),
        (4, 2);  -- koppelt afbeelding 2 aan entry 4 (EN details)
    `);

    console.log("🎉 Database setup complete!");
  } catch (err) {
    console.error("❌ Error setting up the database:", err);
  } finally {
    await client.release();
  }
}

main();
