import admin from "@/lib/notification";
import userModel from "@/models/user.model";
import { Request, Response } from "express";

export async function sendNotification(
  req: Request<
    {},
    {},
    { title: string; description: string; imageUrl: string; token: string }
  >,
  res: Response
) {
  try {
    const { title, description, imageUrl, token } = req.body;
    const message = await admin.messaging().send({
      token: token,
      data: {
        title,
        description,
        imageUrl,
      },
    });

    res.status(201).json({ message: "notificaton send successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `error in sendNotification, ${error?.message}` });
  }
}

export async function registerToken(
  req: Request<{}, {}, { token: string; userId: string }>,
  res: Response
) {
  try {
    const { token, userId } = req.body;

    const findUser = await userModel.findOne({ userDeviceToken: token });

    if (findUser)
      return res.status(400).json({ message: "token already register" });

    const saveUserToken = await userModel.findById(userId);
    if (!saveUserToken)
      return res.status(404).json({ message: "user not found" });

    saveUserToken.userDeviceToken = token;
    await saveUserToken.save();

    res.status(201).json({ message: "register token successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `error in registerNotification, ${error?.message}` });
  }
}
