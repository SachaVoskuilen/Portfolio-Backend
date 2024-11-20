import { z } from "zod";
import {
  emailValidation,
  passwordValidation,
  usernameValidation,
} from "@validation/commonValidations";

export const registerSchema = z.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
});
