import { ObjectId, Types } from "mongoose"

export type likedModelType = {
    userId : Types.ObjectId,
    songs : Types.ObjectId[]
}