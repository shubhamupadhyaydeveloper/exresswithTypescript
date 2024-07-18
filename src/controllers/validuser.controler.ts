import { Request, Response } from "express";
import cloudinary from "@/lib/cloudinaryconfig";

export async function updateProfile(req: Request, res: Response) {
  try {
    if (!req.headers["content-type"]?.startsWith("multipart/form-data"))
      return res.status(422).json({ message: "only form-data is allowed" });

    const {} = req.body

    const arrayBuffer: any = req.file?.buffer;
    const buffer = new Uint8Array(arrayBuffer);

    const imageLink = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, function (error, result) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result?.secure_url);
        })
        .end(buffer);
    });


    res.json({ uploaded: true });
  } catch (error: any) {
    console.log("error in updateProfile", error.message);
  }
   
}
