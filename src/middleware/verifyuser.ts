import e, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "@/models/user.model";

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers["authorization"];

    if (!header) return res.status(400).json({ message: "access token is required" });

    const token = header?.split(" ")[1] as string;

    const { userId } = jwt.verify(token, process.env.JWT_TOKEN as string) as {
      userId: string;
    };

    const userFound = await userModel.findById(userId);

    if (!userFound) return  res.status(404).json({ message: "Invalid token , try login again" });

    console.log('someone call this',userFound)

    req.user = userFound;

    next();
  } catch (error: any) {
    res
      .status(401)
      .json({ message: `error in verifyuser middleware ${error?.message}` });
  }
};
