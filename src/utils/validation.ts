import { ZodSchema } from "zod";

/**
 * Validates incoming data against a Zod schema.
 * @param schema - Zod schema to validate against.
 * @param data - Data to validate (e.g., req.body, req.query, req.headers).
 * @returns Validation result with success status and errors/data.
 */
export const validateRequest = (schema: ZodSchema, data: any) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.log(result.error);
  }

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.reduce<Record<string, string[]>>(
        (acc, issue) => {
          const field = issue.path[0]; // Field name (e.g., "password")
          const message = issue.message;

          // Accumulate messages in an array for each field
          if (!acc[field]) {
            acc[field] = []; // Initialize as an array if not already present
          }
          acc[field].push(message); // Add the current message to the array

          return acc;
        },
        {}
      ),
    };
  }

  return { success: true, data: result.data };
};
