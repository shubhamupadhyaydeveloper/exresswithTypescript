import mongoose , {Model, Schema} from "mongoose";
import { likedModelType } from "@/validation/liked";

const likedSchema = new Schema<likedModelType>({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    songs : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Song"
    }]
},{timestamps : true})

export const likedModel:Model<likedModelType> = mongoose.model("Liked",likedSchema)