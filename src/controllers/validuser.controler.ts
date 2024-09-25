import { json, Request, response, Response } from "express";
import cloudinary from "@/lib/cloudinaryconfig";
import bcrypt from "bcrypt";
import userModel from "@/models/user.model";
import { any } from "joi";
import { ObjectId, Types } from "mongoose";
import { songModel } from "@/models/song.model";
import { songCategory, songClientDataType } from "@/validation/song";
import { likedModel } from "@/models/liked.model";
import { likedModelType } from "@/validation/liked";
import { playlistModel } from "@/models/playlist.model";
import historyModel from "@/models/history.model";

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
              transformation : {
                 quality : "auto",
                 format : "webp"
              }
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
       res
         .status(500)
         .json({ message: `error in update profile, ${error?.message}` });
  }
}

export async function createAudio(
  req: Request<
    {},
    {},
    {}
  >,
  res: Response
) {
  try {
    if (!req.headers["content-type"]?.startsWith("multipart/form-data"))
      return res.status(422).json({ message: "only form-data is allowed" });

    const {error,value} = songClientDataType.validate(req.body)

    if (error) {
        return res.status(400).json({ error: error.details.map((detail) => detail.message) });
    }

    const currentUser = req.user;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if(!files.video) return res.json({message : 'video is required'}).status(400)

    const { title, about, category , singer } = value;

    const createSong = new songModel({
      title,
      about,
      owner: currentUser._id,
      category,
      singer
    });

    await createSong.save();

    if (files.thumbnail) {
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (!allowedMimeTypes.includes(files.thumbnail[0]?.mimetype)) {
        return res
          .status(400)
          .json({
            message: "Invalid thumbnail file type. Only images are allowed.",
          });
      }

      const arrayBuffer: any = files.thumbnail[0]?.buffer;
      const buffer = new Uint8Array(arrayBuffer);

      const result: {
        public_id: string | undefined;
        secure_url: string | undefined;
      } = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              transformation: {
                quality: "auto:eco",
                fetch_format: "auto",
               
              },
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
          .upload_stream({resource_type : 'auto',transformation :{quality : "auto"}}, function (error, result) {
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
      
      createSong.video.public_id = result.public_id as string
      createSong.video.secure_url = result.secure_url as string

      await createSong.save();
    }
    

    res.status(201).json({message : "create audio succesful"});
  } catch (error: any) {
       res
         .status(500)
         .json({ message: `error in create audio, ${error?.message}` });
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
      res
        .status(500)
        .json({ message: `error in create playlist, ${error?.message}` });
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
      res
        .status(500)
        .json({ message: `error in toggle playlist, ${error?.message}` });;
  }
}

export async function updatePlaylist(
  req: Request<
    {},
    {},
    {
      title: string;
      visibility: "Public" | "Private";
      playlistId: Types.ObjectId;
    }
  >,
  res: Response
) {
  try {

    const { title, visibility, playlistId } = req.body;

    const playlistFound = await playlistModel.findById(playlistId);
    if (!playlistFound)
      return res.status(404).json({ message: "playlist not found" });

    (playlistFound.title = title || playlistFound.title),
      (playlistFound.visibility = visibility || playlistFound.visibility);

    await playlistFound.save();

    return res.status(201).json({ message: "update playlist successful" });
  } catch (error: any) {
       res
         .status(500)
         .json({ message: `error in update playlist, ${error?.message}` });
  }
}

export async function deletePlaylist(
  req: Request<{}, {}, { playlistId: Types.ObjectId }>,
  res: Response
) {
  try {
    const { playlistId } = req.body;
    const currentUser = req.user;

    const playlistFound = await playlistModel.findById(playlistId);
    if (!playlistFound)
      return res.status(404).json({ message: "playlist not found" });

    await playlistModel.findByIdAndDelete(playlistId);

    await userModel.updateOne(
      { _id: currentUser?._id },
      { $pull: { playlist: playlistId } }
    );

    return res.status(201).json({ message: "delete playlist successful" });
  } catch (error: any) {
      res
        .status(500)
        .json({ message: `error in delete playlist, ${error?.message}` });
  }
}

export async function playlistByProfile(
  req: Request<{}, {}, {}>,
  res: Response
) {
  try {
    const currentUser = req.user;

    const findPlayist = await playlistModel
      .find({ owner: currentUser?._id })
      .populate("songs");

    return res.status(201).json({ playlists: findPlayist });
  } catch (error: any) {
      res
        .status(500)
        .json({ message: `error in playlist by profile, ${error?.message}` });
  }
}

// follow and unfollow
export async function toggleFollowAndUnfollow(
  req: Request<
    {},
    {},
    {
      secondUserId: Types.ObjectId;
    }
  >,
  res: Response
) {
  try {
    const currentUser = req.user;
    const { secondUserId } = req.body;
    const secondUser = await userModel.findById(secondUserId);

    const isFollowing = currentUser?.followers.includes(currentUser?._id);

    if (isFollowing) {
      // unfollow
      await userModel.updateOne(
        { _id: secondUserId },
        { $pull: { following: currentUser?._id } }
      );

      await userModel.updateOne(
        { _id: currentUser?._id },
        { $pull: { followers: secondUserId } }
      );

      return res.status(200).json({ message: "user unfollow successful" });
    } else {
      // follow user

      await userModel.updateOne(
        { _id: secondUserId },
        { $addToSet: { following: currentUser?._id } }
      );

      await userModel.updateOne(
        { _id: currentUser?._id },
        { $addToSet: { followers: secondUserId } }
      );
      return res.status(200).json({ message: "user follow successful" });
    }
  } catch (error: any) {
      res
        .status(500)
        .json({ message: `error in toggle follow and unfollow , ${error?.message}` });
  }
}

export async function userHistory(
  req: Request<
    {},
    {},
    { userId: Types.ObjectId; songId: Types.ObjectId; progress: number }
  >,
  res: Response
) {
  try {
     
    const {userId,songId,progress} = req.body
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const existingPlay = await historyModel.findOneAndUpdate(
      {userId , songId , date : {$gt : thirtyDaysAgo}},
      {$set : {date : new Date(),progress}},
      {new : true}
    )

    if(!existingPlay) {
       const createPlay = new historyModel({userId,songId,progress}) 
       await createPlay.save()
      }

    await historyModel.deleteMany({ userId, timestamp: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });

  } catch (error: any) {
      res.status(500).json({ message: `error in user history, ${error?.message}` });
  }
}
