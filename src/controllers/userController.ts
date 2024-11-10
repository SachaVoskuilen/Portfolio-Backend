import { Request, Response } from "express";

module.exports = {
  /**
   * Login user
   *
   * @param {} req The required login fields
   * @param {} res Object with login token
   */
  login: async function (req: Request, res: Response) {
    res.send("Becomes login later");
  },
  /**
   * Post/Register a new user
   *
   * @param {} req All required data for a register
   * @param {} res Object with login token
   */
  register: async function (req: Request, res: Response) {
    res.send("Becomes register later");
  },
};
