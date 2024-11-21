import { loginSchema } from "@validation/user/loginValidation";
import { Request, Response } from "express";
import { validateRequest } from "@utils/validation";
import { registerSchema } from "@validation/user/registerValidation";
import pool from "src/database";

module.exports = {
  /**
   * GET/Login user
   *
   * @param {(username || email) && password} req The required login fields
   * @param {} res
   */
  login: async function (req: Request, res: Response) {
    let { success, errors, data } = validateRequest(loginSchema, {
      ...req.body,
      ...req.headers,
    });

    if (!success) {
      return res.status(400).json({ success, errors });
    }

    // On success do something

    res.status(200).json({ success, data });
  },

  /**
   * Post/Register a new user
   *
   * @param {username, email, password} req All required data for a register
   * @param {} res
   */
  register: async function (req: Request, res: Response) {
    let { success, errors, data } = validateRequest(registerSchema, {
      ...req.body,
      ...req.headers,
    });

    if (!success) {
      return res.status(400).json({ success, errors });
    }

    const { username, email, password } = data;

    // Connect to db
    const client = await pool.connect();

    try {
      // Insert user
      const insertQuery = {
        text: "INSERT INTO users (username, email, password) VALUES ($1, $2 ,$3);",
        values: [username, email, password],
      };
      await client.query(insertQuery);

      // Get inserted user
      const queryInsertedUser = {
        text: "SELECT * FROM users WHERE username = $1;",
        values: [username],
      };
      const data = await client.query(queryInsertedUser);
      const user = data.rows[0];

      return res
        .status(201)
        .json({ success, message: "Signup successful", data: user });
    } catch (err) {
      if (err instanceof Error) {
        console.error("Database error:", err.message);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
      console.error("Unknown error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Unexpected error" });
    } finally {
      // Now closes connection
      client.release();
    }
  },
};
