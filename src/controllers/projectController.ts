import { Request, Response } from "express";
import pool from "@database";
import { languageSchema } from "@validation/index";
import { validateRequest } from "@utils/index";
import { ProjectQueryResult, FormattedProject } from "@interfaces/index";
import { getLanguages } from "@helpers/index";
import { Language } from "@models/index";

module.exports = {
  /**
   * GET/Project by slug
   *
   * @param { slug } req The slug of the project to retrieve.
   * @param { languageCode?, languageId? } req The language code (e.g., "en", "fr") or language ID.
   * @param { success, data?, errors? } res The Express response object.
   */
  getProjectBySlug: async function (
    req: Request,
    res: Response
  ): Promise<Response> {
    const { slug } = req.params;
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
            pg.project_group_id,
            pg.slug,
            pe.project_entry_id,
            pe.part,
            pe.title AS entry_title,
            pe.text AS entry_text,
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
          WHERE pe.language_id = $1 AND pg.slug = $2
          GROUP BY pg.project_group_id, pg.slug, pe.project_entry_id, pe.part, pe.title, pe.text
          ORDER BY pg.project_group_id, pe.part;
        `,
        [languageId, slug]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          errors: ["Project not found"],
        });
      }

      const projectMap = new Map<number, FormattedProject>();

      result.rows.forEach((row: ProjectQueryResult) => {
        const {
          project_group_id,
          slug,
          part,
          entry_title,
          entry_text,
          entry_images,
        } = row;

        if (!projectMap.has(project_group_id)) {
          projectMap.set(project_group_id, {
            title: "",
            slug: slug,
            paragraphs: [],
            all_project_images: [],
          });
        }

        const currentProject = projectMap.get(project_group_id)!;

        if (part === 1) {
          currentProject.title = entry_title;
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
        currentProject.paragraphs.push(paragraph);

        entry_images.forEach((img: { image_url: string }) => {
          if (!currentProject.all_project_images.includes(img.image_url)) {
            currentProject.all_project_images.push(img.image_url);
          }
        });
      });

      const formattedProject = Array.from(projectMap.values())[0];

      return res.status(200).json({
        success: true,
        data: formattedProject,
      });
    } catch (err) {
      console.error("Error fetching project by slug:", err);
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * GET/Projects
   *
   * @param { languageCode?, languageId? } req The language code (e.g., "en", "fr") or language ID.
   * @param { success, data?, errors? } res The Express response object.
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
            pg.project_group_id,
            pg.slug,
            pe.project_entry_id,
            pe.part,
            pe.title AS entry_title,
            pe.text AS entry_text,
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
          WHERE pe.language_id = $1
          GROUP BY pg.project_group_id, pg.slug, pe.project_entry_id, pe.part, pe.title, pe.text
          ORDER BY pg.project_group_id, pe.part;
      `,
        [languageId]
      );

      const projectsMap = new Map<number, FormattedProject>();

      result.rows.forEach((row: ProjectQueryResult) => {
        const {
          project_group_id,
          slug,
          part,
          entry_title,
          entry_text,
          entry_images,
        } = row;

        if (!projectsMap.has(project_group_id)) {
          projectsMap.set(project_group_id, {
            title: "",
            slug: slug,
            paragraphs: [],
            all_project_images: [],
          });
        }

        const currentProject = projectsMap.get(project_group_id)!;

        if (part === 1) {
          currentProject.title = entry_title;
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
        currentProject.paragraphs.push(paragraph);

        entry_images.forEach((img: { image_url: string }) => {
          if (!currentProject.all_project_images.includes(img.image_url)) {
            currentProject.all_project_images.push(img.image_url);
          }
        });
      });

      const formattedProjects = Array.from(projectsMap.values());

      return res.status(200).json({
        success: true,
        data: formattedProjects,
      });
    } catch (err) {
      console.error("Error fetching projects:", err);
      throw err;
    } finally {
      client.release();
    }
  },
};
