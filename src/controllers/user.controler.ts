import { Request, Response } from "express";
import {
  TloginUserDto,
  TuserDto,
  loginUserSchemaJoi,
  singupScheamJoi,
} from "@/dto/user";
import userModel from "@/models/user.model";
import bcrypt from "bcrypt";
import createToken from "@/lib/createtoken";

export async function signUpUser(
  req: Request<{}, {}, TuserDto>,
  res: Response
) {
  try {
  
  } catch (error: any) {
    console.log("error in sign upUser");
    res.json({ success: false, message: error.message });
  }
}

export async function loginUser(
  req: Request<{}, {}, TloginUserDto>,
  res: Response
) {
  try {
 
  } catch (error: any) {
    console.log("error in login user", error?.message);
  }
}

export async function logout(req:Request,res:Response) {
  try {
    res.cookie("token","",{maxAge : 1});
    res.json({success : true,message : "logout successful"})
    
  } catch (error:any) {
    console.log("error in logout",error?.message)
  }
}