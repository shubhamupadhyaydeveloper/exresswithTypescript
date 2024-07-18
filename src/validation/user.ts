import J from "joi"
import { Request } from "express"

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
   playlist : string[],
   profileImage : string
}



export const signUpClientDataType = J.object({
    username : J.string().required(),
    email : J.string().email().required(),
    password :  J.string().required(),
})


export const loginClientDataType = J.object({
    password : J.string().required(),
    email : J.string().email().required()
})