import mongoose , {Model, Schema} from "mongoose";
import { TuserDto } from "../dto/user";

const userSchema = new Schema<TuserDto>({
    username : {
        type : String,
        required: true,
        trim : true,
        min :  2
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        trim  : true
    }
});

const userModel:Model<TuserDto> = mongoose.model("User",userSchema)
export default userModel;