import mongoose , {Model, Schema} from "mongoose";
import { userModelType } from "@/validation/user";

const userSchema = new Schema<userModelType>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      min: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    forgetCode: {
      type: String,
    },
    forgetCodeExpiry: {
      type: Date,
    },
    followers: [
      {
        type: String,
        default: [],
      },
    ],
    following: [
      {
        type: String,
        default: [],
      },
    ],
    playlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
        default: [],
      },
    ],
    profileImage: {
      type: Object,
      secure_url: String,
      public_id: String,
    },
    userDeviceToken: {
      type: String,
    },
    authMethod: {
      type: String,
      enum: ["manual","google"],
    },
  },
  { timestamps: true }
);

const userModel:Model<userModelType> = mongoose.model("User",userSchema)
export default userModel;