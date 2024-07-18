import mongoose , {Model, Schema} from "mongoose";
import { userModelType } from "@/validation/user";
import { string } from "joi";

const userSchema = new Schema<userModelType>({
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
    },
    otp : {
       type : String,
       required : true
    },
    otpExpiry : {
        type : Date,
        required : true,
        default : Date.now()
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    forgetCode : {
        type : String
    },
    forgetCodeExpiry : {
        type : Date
    },
    followers : [{
        type : String,
        default : []
    }],
    following : [{
        type : String,
        default : []
    }],
    playlist : [{
        type : String,
        default : []
    }],
    profileImage : {
        type : String,
        default :  ""
    }
},{timestamps : true});

const userModel:Model<userModelType> = mongoose.model("User",userSchema)
export default userModel;