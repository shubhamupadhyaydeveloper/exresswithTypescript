import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import userModel from "@/models/user.model";
import { JWT_TOKEN } from "@/lib/variable";

export const verifyUser = (): RequestHandler => {
  return async (req, res, next) => {
    const { token } = res.cookie as { token?: string };

    if (!token) {
      res.json({ success: "false", message: "Unauthorised user" }).status(401);
    }

    const verifyToken = jwt.verify(token!, JWT_TOKEN) as {
      userId: string;
    };

    const userFound = await userModel.findById(verifyToken.userId);

    if (!userFound) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = userFound;
    next();
  };
};
