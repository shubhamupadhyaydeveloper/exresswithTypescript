import { Request, Response } from "express";
import {
  TloginUserDto,
  TuserDto,
  loginUserSchemaJoi,
  singupScheamJoi,
} from "../dto/user";
import userModel from "../models/user.model";
import bcrypt from "bcrypt";
import createToken from "../lib/createtoken";

export async function signUpUser(
  req: Request<{}, {}, TuserDto>,
  res: Response
) {
  try {
    const { error, value } = singupScheamJoi.validate(req.body);
    if (error)
      return res
        .json({ success: false, message: error.details[0].message })
        .status(400);
    const { username, email, password } = value;
    if (!username || !email || !password)
      return res
        .json({ success: false, message: "credentials not complete" })
        .status(400);

    const isUserAlreadyExists = await userModel.findOne({ username });
    if (isUserAlreadyExists)
      return res.json({ success: false, message: "user is already created" });

    const hasedPassword = await bcrypt.hash(password, 10);

    const newUserCreate = await userModel.create({
      username,
      email,
      password: hasedPassword,
    });

    await newUserCreate.save();

    if (newUserCreate) {
      createToken(newUserCreate._id, res);
      res.json({ success: true, data: newUserCreate });
    }
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
    const { error, value } = loginUserSchemaJoi.validate(req.body);
    if (error) {
      return res
        .json({ success: false, message: error.details[0].message })
        .status(400);
    }
    const {email,password} = value
    const userFound = await userModel.findOne({email})
    if(!userFound) return res.status(404).json({success : false,message :'User not found'})

    const passwordMatch = await bcrypt.compare(password,userFound.password)

    if(!passwordMatch) return res.status(401).json({success : false,message : "credentials are invalid"})

    if(userFound && passwordMatch) {
       createToken(userFound._id,res);
       res.json({success : true,message : userFound})
    }

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