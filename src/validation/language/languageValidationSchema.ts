import { z } from "zod";
import { getLanguageCodes, getLanguageIds } from "@helpers/index";

const languageCodes = getLanguageCodes();
const languageIds = getLanguageIds();

export const languageSchema = z
  .object({
    languageCode: z
      .string()
      .transform((s) => s.toUpperCase())
      .optional()
      .refine((val) => !val || languageCodes.includes(val), {
        message: "Invalid language code",
      }),
    languageId: z
      .preprocess((val) => Number(val), z.number())
      .optional()
      .refine((val) => !val || languageIds.includes(val), {
        message: "Invalid language id",
      }),
  })
  .refine((data) => data.languageCode || data.languageId, {
    message: "Either languageCode or languageId must be provided",
    path: ["languageCode", "languageId"],
  });
