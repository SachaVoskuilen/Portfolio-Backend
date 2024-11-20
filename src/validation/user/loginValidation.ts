import { z } from "zod";
import {
  emailValidation,
  passwordValidation,
  usernameValidation,
} from "@validation/commonValidations";

export const loginSchema = z
  .object({
    username: usernameValidation.optional(),
    email: emailValidation.optional(),
    password: passwordValidation,
  })
  .refine((data) => data.username || data.email, {
    message: "Either username or email must be provided.",
    path: ["username or email"], // Assign error to a generic field
  });
