import { Request, Response } from "express";
import pool from "@database";
import { languageSchema } from "@validation/index";
import { validateRequest } from "@utils/index";
import { AboutMeQueryResult, FormattedAboutMe } from "@interfaces/index";
import { getLanguages } from "@helpers/index";
import { Language } from "@models/index";

module.exports = {
  /**
   * GET/About-me page content
   *
   * @param { languageCode?, languageId? } req The language code (e.g., "en", "fr") or language ID.
   * @param { success, data?, errors? } res The Express response object.
   */
  aboutMe: async function (req: Request, res: Response): Promise<Response> {
    const { success, errors, data } = validateRequest(
      languageSchema,
      req.query
    );

    if (!success) {
      return res.status(400).json({
        success: false,
        errors: errors,
      });
    }

    let { languageCode, languageId } = data;

    const client = await pool.connect();

    try {
      const languages = getLanguages();
      const targetLanguage = languages.find(
        (lang: Language) =>
          lang.code === languageCode || lang.language_id === languageId
      );

      if (!targetLanguage) {
        return res.status(404).json({
          success: false,
          errors: ["Language not found"],
        });
      }

      languageId = targetLanguage.language_id;
      languageCode = targetLanguage.code;

      const result = await client.query(
        `
          SELECT
            amg.about_me_group_id,
            amg.slug,
            ame.about_me_entry_id,
            ame.part,
            ame.title AS entry_title,
            ame.text AS entry_text,
            COALESCE(
              json_agg(DISTINCT jsonb_build_object(
                'image_id', ami.image_id,
                'image_url', ami.image_url,
                'alt_text', ami.alt_text,
                'sort_order', ami.sort_order
              )) FILTER (WHERE ami.image_id IS NOT NULL),
              '[]'
            ) AS entry_images
          FROM about_me_group amg
          JOIN about_me_entry ame ON ame.about_me_group_id = amg.about_me_group_id
          LEFT JOIN about_me_entry_image amei ON amei.about_me_entry_id = ame.about_me_entry_id
          LEFT JOIN about_me_image ami ON ami.image_id = amei.image_id
          JOIN language l ON ame.language_id = l.language_id
          WHERE ame.language_id = $1
          GROUP BY amg.about_me_group_id, amg.slug, ame.about_me_entry_id, ame.part, ame.title, ame.text
          ORDER BY amg.about_me_group_id, ame.part;
        `,
        [languageId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          errors: ["About Me content not found"],
        });
      }

      const aboutMeMap = new Map<number, FormattedAboutMe>();

      result.rows.forEach((row: AboutMeQueryResult) => {
        const {
          about_me_group_id,
          slug,
          part,
          entry_title,
          entry_text,
          entry_images,
        } = row;

        if (!aboutMeMap.has(about_me_group_id)) {
          aboutMeMap.set(about_me_group_id, {
            title: "",
            slug: slug,
            paragraphs: [],
            all_about_me_images: [],
          });
        }

        const currentAboutMe = aboutMeMap.get(about_me_group_id)!;

        if (part === 1) {
          currentAboutMe.title = entry_title;
        }

        const paragraph: {
          part: number;
          title: string;
          text: string;
          images?: Array<{
            image_url: string;
            alt_text: string;
          }>;
        } = {
          part: part,
          title: entry_title,
          text: entry_text,
        };
        if (entry_images && entry_images.length > 0) {
          paragraph.images = entry_images.map(
            (img: { image_url: string; alt_text: string }) => ({
              image_url: img.image_url,
              alt_text: img.alt_text,
            })
          );
        }
        currentAboutMe.paragraphs.push(paragraph);

        entry_images.forEach((img: { image_url: string }) => {
          if (!currentAboutMe.all_about_me_images.includes(img.image_url)) {
            currentAboutMe.all_about_me_images.push(img.image_url);
          }
        });
      });

      const formattedAboutMe = Array.from(aboutMeMap.values())[0];

      return res.status(200).json({
        success: true,
        data: formattedAboutMe,
      });
    } catch (err) {
      console.error("Error fetching about me content:", err);
      throw err;
    } finally {
      client.release();
    }
  },
};
