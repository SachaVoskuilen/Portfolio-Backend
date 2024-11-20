import { loginSchema } from "@validation/user/loginValidation";
import { Request, Response } from "express";
import { validateRequest } from "@utils/validation";
import { registerSchema } from "@validation/user/registerValidation";

module.exports = {
  /**
   * GET/Login user
   *
   * @param {(username || email) && password} req The required login fields
   * @param {} res
   */
  login: async function (req: Request, res: Response) {
    const { success, errors, data } = validateRequest(loginSchema, {
      ...req.body,
      ...req.headers,
    });

    console.log(errors);

    if (!success) {
      return res.status(400).json({ errors });
    }

    res.status(200).json({ message: "Login successful", data });
  },

  /**
   * Post/Register a new user
   *
   * @param {username, email, password} req All required data for a register
   * @param {} res
   */
  register: async function (req: Request, res: Response) {
    const { success, errors, data } = validateRequest(registerSchema, {
      ...req.body,
      ...req.headers,
    });

    if (!success) {
      return res.status(400).json({ errors });
    }

    res.status(200).json({ message: "Register successful", data });
  },
};
