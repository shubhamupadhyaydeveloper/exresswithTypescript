import admin from "@/lib/firebase";
import userModel from "@/models/user.model";
import { Request, Response } from "express";

export async function sendNotification(
  req: Request<
    {},
    {},
    { title: string; token: string; description: string; imageUrl: string }
  >,
  res: Response
) {
  try {
    const { title, token, description, imageUrl } = req.body;

    const sendMessage = await admin.messaging().send({
      token,
      data: {
        title,
        description,
        imageUrl,
      },
    });

    res
      .status(200)
      .send(`notification send successful ${JSON.stringify(sendMessage)}`);
  } catch (error) {
    res.status(500).json({ message: "error in sendnotification" });
  }
}

export async function broadCastNotification(req: Request, res: Response) {
  try {
  } catch (error) {
    res.status(500).json({ message: "error in broadcast notification" });
  }
}

export async function registerNotification(
  req: Request<{}, {}, { deviceToken: string }>,
  res: Response
) {
  try {
    const {deviceToken} = req.body
 
    res.status(200).json({message : deviceToken})
  } catch (error) {
    res.status(500).json({ message: "error in register notificaton" });
  }
}

export async function accessTokenTest(req:Request,res:Response) {
    try {
      const user = req.user
      res.status(200).json({userDetail : user})
    } catch (error:any) {
         res.status(500).json({ message: "error in access token" ,error : error.message});
    }
}