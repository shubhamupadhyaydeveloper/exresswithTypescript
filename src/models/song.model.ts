import mongoose , {Model, Schema} from "mongoose";
import { songModelType } from "@/validation/song";

const songSchema = new Schema<songModelType>({
     title : {
         type : String,
         required : true,
         trim : true
     },
     about :{
        type : String,
        required : true
     },
     owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
     },
     thumbnail : {
        type : Object,
        secure_url : String,
        public_id : String,
        required : true
     },
     video : {
        type : Object,
        secure_url : String,
        public_id : String,
        required : true
     },
     category : {
         type : String,
         enum : ["Romantic" , "Classic",  "Modern" , "Punjabi" , "English" , "Rap"],
         required : true
     },
     likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
     }],
     singer : {
      type : String,
      required : true
     }
},{timestamps : true})

export const songModel:Model<songModelType> = mongoose.model("Song",songSchema)