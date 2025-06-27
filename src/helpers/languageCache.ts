import { Language } from "@models/index";
import pool from "@database";

let cachedLanguages: Language[] | null = null;

export async function loadLanguages() {
  if (cachedLanguages) return cachedLanguages;

  const res = await pool.query(
    `SELECT language_id, name, code FROM language ORDER BY language_id`
  );

  cachedLanguages = res.rows;
  return cachedLanguages;
}

export function getLanguages(): Language[] {
  if (!cachedLanguages) {
    throw new Error("Languages not loaded yet! Call loadLanguages() first.");
  }
  return cachedLanguages;
}

export function getLanguageCodes(): string[] {
  return getLanguages().map((l) => l.code);
}

export function getLanguageIds(): number[] {
  return getLanguages().map((l) => l.language_id);
}
