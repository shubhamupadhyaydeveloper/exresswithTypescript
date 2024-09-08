import { Types } from "mongoose";

export type historyModelType = {
   userId : Types.ObjectId,
   songId : Types.ObjectId,
   progress : number,
   date : Date
};
