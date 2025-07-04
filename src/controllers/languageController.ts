import { Request, Response } from "express";
import { getLanguages, loadLanguages } from "@helpers/index";

module.exports = {
  getLanguages: async function (req: Request, res: Response) {
    try {
      await loadLanguages();
      const langs = getLanguages();
      res.status(200).json(langs);
    } catch (error) {
      console.error("Error fetching languages:", error);
      res.status(500).json({ error: "Failed to load languages" });
    }
  },
};
