import { ObjectId, Types } from "mongoose"
import Joi, { string } from "joi"

export type playlistVisibiltyOptions = "Public" | "Private" 

export type playlistModelType = {
  title: string;
  owner: Types.ObjectId;
  songs: Types.ObjectId[];
  visibility: playlistVisibiltyOptions;
  description: string;
  imageUrl: {
    secure_url: string;
    public_id: string;
  };
};

export const playlistClientDataType = Joi.object({
     title : Joi.string().required(),
     owner : Joi.string().required(),
     songs : Joi.array().items(Joi.string()),
     visibility : Joi.string().valid("Public" , "Private"),
     description : Joi.string().optional(),
})

export const updatePlaylistClientDataType = Joi.object({
    title : Joi.string().required(),
    visibility : Joi.string().valid("Public" , "Private").optional(),
    playlistId : Joi.string().required(),
})
