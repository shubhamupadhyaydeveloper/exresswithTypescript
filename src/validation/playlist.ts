import { ObjectId, Types } from "mongoose"
import Joi, { string } from "joi"

export type playlistVisibiltyOptions = "Public" | "Private" 

export type playlistModelType = {
    title : string, 
    owner : Types.ObjectId,
    songs : Types.ObjectId[],
    visibility : playlistVisibiltyOptions
}

export const playlistClientDataType = Joi.object({
     title : Joi.string().required(),
     owner : Joi.string().required(),
     songs : Joi.array().items(Joi.string()),
     visibility : Joi.string().valid("Public" , "Private")
})

export const updatePlaylistClientDataType = Joi.object({
    title : Joi.string().required(),
    visibility : Joi.string().valid("Public" , "Private")
})
