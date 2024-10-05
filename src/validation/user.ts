import J from "joi"
import { Request } from "express"
import { Types } from "mongoose"


export type userModelType = {
   username : string,
   email : string,
   password : string,
   otp : string,
   otpExpiry : Date,
   forgetCode : string,
   forgetCodeExpiry : Date,
   isVerified : boolean,
   followers : string[],
   following : string[],
   playlist : Types.ObjectId[],
   profileImage : {
      secure_url : string,
      public_id : string
   }
   userDeviceToken : string,
   authMethod : 'manual' | 'google'
}


export const signUpClientDataType = J.object({
  username: J.string().required(),
  email: J.string().email().required(),
  password: J.string().required(),
  method: J.string().valid("manual", "google").required(),
  userDeviceToken : J.string().optional()
});


export const loginClientDataType = J.object({
    password : J.string().required(),
    email : J.string().email().required()
})