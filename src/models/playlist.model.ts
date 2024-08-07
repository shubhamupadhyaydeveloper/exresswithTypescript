import mongoose , {Model, Schema} from "mongoose";
import { playlistModelType } from "@/validation/playlist";

const playlistSchema = new Schema<playlistModelType>({
   title : {
     type : String,
     required : true
   },
   owner : {
     type : mongoose.Schema.Types.ObjectId,
     ref : "User",
     required : true
   },
   songs : [
     {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Song"
     }
   ],
   visibility : {
     type : String,
     enum : ["Public","Private"],
     default : "Private",
     required : true
   }
},{timestamps : true})

export const playlistModel:Model<playlistModelType> = mongoose.model("Playlist",playlistSchema)