import { songModel } from "@/models/song.model";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

export async function getSongById(
  req: Request<{}, {}, { songId: string }>,
  res: Response
) {
  try {
    const { songId } = req.body;
    if (!songId) return res.status(400).json({ message: "songId is required" });
   
    if(!isValidObjectId(songId)) return res.status(400).json({ message: "invalid song id" });

    const findSong = await songModel.findById(songId);
    if (!findSong) return res.status(404).json({ message: "song not find invalid song Id" });

    return res.status(200).send(findSong)
  } catch (error: any) {
    res.status(500).json({ message: "error in getSongById " + error?.message });
  }
}
