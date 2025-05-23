import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { DatabaseError } from "pg";
import pool from "src/database";
import { validateRequest } from "@utils/validation";
import { loginSchema } from "@validation/user/loginValidation";
import { registerSchema } from "@validation/user/registerValidation";

module.exports = {
  /**
   * POST/Login user
   *
   * @param { username || email, password } req The required login fields.
   * @param { success, error?, token?, message? } res Express response object.
   */
  login: async function (req: Request, res: Response): Promise<Response> {
    // Validate request input
    const { success, errors, data } = validateRequest(loginSchema, {
      ...req.body,
      ...req.headers,
    });

    if (!success) {
      return res.status(400).json({ success: false, errors });
    }

    const { username, email, password } = data;

    // Connect to the database
    const client = await pool.connect();

    try {
      // Query user by username or email
      const queryUser = {
        text: "SELECT * FROM users WHERE username = $1 OR email = $2;",
        values: [username, email],
      };
      const result = await client.query(queryUser);
      const user = result.rows[0];

      // Check if user exists
      if (!user) {
        return res.status(404).json({
          success: false,
          errors: { credentials: "No user found with the provided details" },
        });
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          errors: { credentials: "Invalid password" },
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      // Respond with token
      return res.status(200).json({
        success: true,
        data: { token, message: "Login successful" },
      });
    } catch (err) {
      console.error("Unexpected error during login:", err);
      return res.status(500).json({
        success: false,
        errors: { internal: "Internal server error" },
      });
    } finally {
      client.release();
    }
  },

  /**
   * POST/Register a new user
   *
   * @param { username, email, password } req All required data for registration.
   * @param { success, error?, token?, message? } res Express response object.
   */
  register: async function (req: Request, res: Response): Promise<Response> {
    // Validate request input
    const { success, errors, data } = validateRequest(registerSchema, {
      ...req.body,
      ...req.headers,
    });

    if (!success) {
      return res.status(400).json({ success: false, errors });
    }

    const { username, email, password } = data;

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Connect to the database
    const client = await pool.connect();

    try {
      // Insert user into the database
      const insertQuery = {
        text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
        values: [username, email, hashedPassword],
      };
      const result = await client.query(insertQuery);
      const user = result.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      // Respond with token and success message
      return res.status(201).json({
        success: true,
        data: { token, message: "Signup successful" },
      });
    } catch (err) {
      const error = err as DatabaseError;

      // Handle unique constraint violation errors
      if (error.code === "23505") {
        const errorField = error.detail?.match(/Key \((.*?)\)/)?.[1];
        if (errorField) {
          return res.status(400).json({
            success: false,
            errors: {
              [errorField]: `${
                errorField.charAt(0).toUpperCase() + errorField.slice(1)
              } already taken`,
            },
          });
        }
      }

      console.error("Unexpected error during registration:", err);
      return res.status(500).json({
        success: false,
        errors: { internal: "Internal server error" },
      });
    } finally {
      client.release();
    }
  },
};
