import { Request, Response } from "express";
import pool from "@database";
import { languageSchema } from "@validation/index";
import { validateRequest } from "@utils/index";

module.exports = {
  /**
   * GET/About-me page content
   *
   * @param {} req No required fields.
   * @param {} res Express response object.
   */
  getProjects: async function (req: Request, res: Response): Promise<Response> {
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

    var { languageCode, languageId } = data;

    const client = await pool.connect();

    try {
      const languageRes = await client.query(
        `SELECT language_id FROM language WHERE code = $1`,
        [data.languageCode]
      );

      if (languageRes.rowCount === 0) {
        throw new Error("Language not found");
      }

      const result = await client.query(
        `
          SELECT 
            pg.project_group_id,
            pg.slug,
            pe.project_entry_id,
            pe.part,
            pe.title,
            pe.text,
            COALESCE(
              json_agg(DISTINCT jsonb_build_object(
                'image_id', pi.image_id,
                'image_url', pi.image_url,
                'alt_text', pi.alt_text,
                'sort_order', pi.sort_order
              )) FILTER (WHERE pi.image_id IS NOT NULL),
              '[]'
            ) AS entry_images
          FROM project_group pg
          JOIN project_entry pe ON pe.project_group_id = pg.project_group_id
          LEFT JOIN project_entry_image pei ON pei.project_entry_id = pe.project_entry_id
          LEFT JOIN project_image pi ON pi.image_id = pei.image_id
          JOIN language l ON pe.language_id = l.language_id
          WHERE 
            (
              ($1::int IS NOT NULL AND pe.language_id = $1)
              OR
              ($2::varchar IS NOT NULL AND l.code = $2)
            )
          GROUP BY pg.project_group_id, pg.slug, pe.project_entry_id, pe.part, pe.title, pe.text
          ORDER BY pg.project_group_id, pe.part;
      `,
        [languageId, languageCode]
      );

      return res.status(200).json({
        success: true,
        data: result.rows,
      });
    } catch (err) {
      console.error("Error fetching projects:", err);
      throw err;
    } finally {
      client.release();
    }
  },
};
