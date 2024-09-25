import mongoose, { Model, Schema } from "mongoose";
import { songModelType } from "@/validation/song";

const songSchema = new Schema<songModelType>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    video: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    category: {
      type: String,
      enum: ["Romantic", "Classic", "Modern", "Punjabi", "English", "Rap"],
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    singer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const songModel: Model<songModelType> = mongoose.model(
  "Song",
  songSchema
);
