import e, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "@/models/user.model";
import { JWT_TOKEN } from "@/lib/variable";

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers["authorization"];

    if (!header) res.status(400).json({ message: "refresh token is required" });

    const token = header?.split(" ")[1] as string;

    const { userId } = jwt.verify(token, process.env.JWT_TOKEN as string) as {
      userId: string;
    };

    const userFound = await userModel.findById(userId);

    if (!userFound)
      res.status(400).json({ message: "Invalid token , try login again" });

    req.user = userFound;

    next();
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `error in verifyuser middleware ${error?.message}` });
  }
};
