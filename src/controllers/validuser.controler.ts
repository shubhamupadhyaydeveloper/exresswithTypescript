import { json, Request, Response } from "express";
import cloudinary from "@/lib/cloudinaryconfig";
import bcrypt from "bcrypt";
import userModel from "@/models/user.model";
import { any } from "joi";
import { ObjectId, Types } from "mongoose";
import { songModel } from "@/models/song.model";
import { songCategory } from "@/validation/song";
import { likedModel } from "@/models/liked.model";
import { likedModelType } from "@/validation/liked";
import { playlistModel } from "@/models/playlist.model";

export async function updateProfile(
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response
) {
  try {
    if (!req.headers["content-type"]?.startsWith("multipart/form-data"))
      return res.status(422).json({ message: "only form-data is allowed" });

    const user = req.user;
    const userFound = await userModel.findOne({ email: user?.email });

    if (!userFound) return res.status(400).json({ message: "user not found" });

    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const arrayBuffer: any = req.file?.buffer;
    const buffer = new Uint8Array(arrayBuffer);

    if (req?.file) {
      // delete previous file
      cloudinary.uploader.destroy(userFound.profileImage.public_id);

      const result: {
        secure_url: string | undefined;
        public_id: string | undefined;
      } = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              width: 300,
              height: 300,
              crop: "thumb",
              gravity: "force",
            },
            function (error, result) {
              if (error) {
                reject(error);
                return;
              }
              resolve({
                secure_url: result?.secure_url,
                public_id: result?.public_id,
              });
            }
          )
          .end(buffer);
      });

      userFound.profileImage.secure_url = result?.secure_url || "";
      userFound.profileImage.public_id = result?.public_id || "";

      await userFound.save();
    }

    userFound.password = hashedPassword || userFound.password;
    userFound.username = username || userFound.username;

    await userFound.save();

    res
      .status(201)
      .json({ uploaded: true, message: "userproflie updated successful" });
  } catch (error: any) {
    console.log("error in updateProfile", error.message);
  }
}

export async function createAudio(
  req: Request<
    {},
    {},
    { title: string; about: string; category: songCategory }
  >,
  res: Response
) {
  try {
    if (!req.headers["content-type"]?.startsWith("multipart/form-data"))
      return res.status(422).json({ message: "only form-data is allowed" });

    const currentUser = req.user;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const { title, about, category } = req.body;

    const createSong = new songModel({
      title,
      about,
      owner: currentUser._id,
      category,
    });

    await createSong.save();

    if (files.thumbnail) {
      const arrayBuffer: any = files.thumbnail[0]?.buffer;
      const buffer = new Uint8Array(arrayBuffer);

      const result: {
        public_id: string | undefined;
        secure_url: string | undefined;
      } = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({}, function (error, result) {
            if (error) {
              reject(error);
              return;
            }
            resolve({
              secure_url: result?.secure_url,
              public_id: result?.public_id,
            });
          })
          .end(buffer);
      });

      createSong.thumbnail.public_id = result?.public_id || "";
      createSong.thumbnail.secure_url = result?.secure_url || "";

      await createSong.save();
    }

    if (files.video) {
      const arrayBuffer: any = files.video[0]?.buffer;
      const buffer = new Uint8Array(arrayBuffer);

      const result: {
        public_id: string | undefined;
        secure_url: string | undefined;
      } = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({}, function (error, result) {
            if (error) {
              reject(error);
              return;
            }
            resolve({
              secure_url: result?.secure_url,
              public_id: result?.public_id,
            });
          })
          .end(buffer);
      });

      createSong.video.public_id = result?.public_id || "";
      createSong.video.secure_url = result?.secure_url || "";

      await createSong.save();
    }

    res.status(201).json({ videoUploaded: true, thumbnailUploaded: true });
  } catch (error: any) {
    console.log("error in createAudio", error.message);
  }
}

export async function createPlaylist(
  req: Request<
    {},
    {},
    { title: string; owner: ObjectId; songId: ObjectId; visibilty: string }
  >,
  res: Response
) {
  try {
    const { title, owner, songId, visibilty } = req.body;
    const userFound = await userModel.findById(owner);
    if (!userFound) return res.status(404).json({ message: "user not found" });

    const createPlaylist = new playlistModel({
      title,
      owner,
      songs: [songId],
      visibility: visibilty,
    });

    await createPlaylist.save();

    userFound.playlist.push(createPlaylist!._id);
    await userFound.save();

    res.status(201).json({ message: "playlist created" });
  } catch (error: any) {
    console.log("error in createPlaylist", error?.message);
  }
}

export async function togglePlaylist(
  req: Request<{}, {}, { songId: Types.ObjectId; playlistId: Types.ObjectId }>,
  res: Response
) {
  try {
    const { songId, playlistId } = req.body;

    const currentUser = req.user;
    const findPlayist = await playlistModel.findById(playlistId);
    if (!findPlayist)
      return res.status(404).json({ message: "Playlist not found" });

    const alreadyAdded = findPlayist.songs.includes(songId);

    if (alreadyAdded) {
      // remove song
      await playlistModel.updateOne(
        { _id: playlistId },
        { $pull: { songs: songId } }
      );
      res.status(200).json({ message: "song removed" });
    } else {
      // add song
      await playlistModel.updateOne(
        { _id: playlistId },
        { $addToSet: { songs: songId } }
      );

      res.status(200).json({ message: "song added" });
    }
  } catch (error: any) {
    console.log("error in togglePlaylist", error?.message);
  }
}

export async function updatePlaylist(
  req: Request<{}, {}, { title : string , visibility : "Public" | "Private",playlistId : Types.ObjectId }>,
  res: Response
) {
  try {
    const {title,visibility,playlistId} = req.body
    
    const playlistFound = await playlistModel.findById(playlistId)
    if(!playlistFound ) return res.status(404).json({message : "playlist not found"})

    playlistFound.title = title || playlistFound.title,
    playlistFound.visibility = visibility || playlistFound.visibility

    await playlistFound.save();

    return res.status(201).json({message : "update playlist successful"})
  } catch (error: any) {
    console.log("error in updatePlaylist", error?.message);
  }
}
