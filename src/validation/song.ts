import Joi from "joi"
import { ObjectId, Types } from "mongoose"

export type songCategory = "Romantic" | "Classic" | "Modern" | "Punjabi" | "English" | "Rap"

export type songModelType = {
     title : string,
     about : string,
     owner : Types.ObjectId,
     video : {
         secure_url : string,
         public_id : string
     },
     thumbnail : {
         secure_url : string,
         public_id : string
     },
     likes : ObjectId[],
     category : songCategory,
     singer : string
}


export const songClientDataType = Joi.object({
  title: Joi.string().required(),
  about: Joi.string().required(),
  singer: Joi.string().required(),
  category: Joi.string().valid(
    "Romantic",
    "Classic",
    "Modern",
    "English",
    "Rap"
  ).required(),
});