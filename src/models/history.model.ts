import mongoose, {Model, mongo, Schema,Types} from "mongoose";
import { historyModelType } from "@/validation/history";

const historySchema = new Schema<historyModelType>({
   userId : {
     type : Schema.Types.ObjectId,
     ref : "User",
     required: true
   },
   progress : {
     type : Number,
     default : 0
   },
   songId : {
    type : Schema.Types.ObjectId,
    ref :"Song",
    required : true
  },
  date: { type: Date, default: Date.now }
},{timestamps : true})

const historyModel:Model<historyModelType> = mongoose.model("History",historySchema)
export default historyModel  