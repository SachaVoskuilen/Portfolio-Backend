import { Request, Response } from "express";

module.exports = {
  /**
   * Return to documentation on empty api url
   *
   * No @param {} req The required url is already here
   * No @param {} res Just a redirection
   */
  default: async function (req: Request, res: Response) {
    var url = req.baseUrl;
    res.status(200).redirect(`${url.slice(0, url.lastIndexOf("/"))}/`);
  },
};
