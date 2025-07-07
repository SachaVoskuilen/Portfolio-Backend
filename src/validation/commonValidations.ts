import { z } from "zod";

// Reusable and central username validation
export const usernameValidation = z
  .string()
  .trim()
  .min(1, "Username cannot be empty");

// Reusable and central email validation
export const emailValidation = z
  .string()
  .trim()
  .email("Invalid email")
  .min(1, "Email cannot be empty");

// Reusable and central password validation
export const passwordValidation = z.string().superRefine((val, ctx) => {
  // Check minimum length
  if (val.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 8,
      inclusive: true,
      type: "string",
      message: "Password must be at least 8 characters long",
    });
  }

  // Check maximum length
  if (val.length > 64) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 64,
      inclusive: true,
      type: "string",
      message: "Password cannot exceed 64 characters",
    });
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must contain at least one uppercase letter",
    });
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must contain at least one lowercase letter",
    });
  }

  // Check for numbers
  if (!/[0-9]/.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must contain at least one number",
    });
  }
});
