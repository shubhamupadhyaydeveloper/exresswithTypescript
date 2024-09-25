import mongoose , {Model, Schema} from "mongoose";
import { playlistModelType } from "@/validation/playlist";

const playlistSchema = new Schema<playlistModelType>(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
      required: true,
    },
    imageUrl: {
      type : Object,
      secure_url : '',
      public_id : ''
    },
    description : {
      type : String,
      default : ''
    }
  },
  { timestamps: true }
);

export const playlistModel:Model<playlistModelType> = mongoose.model("Playlist",playlistSchema)