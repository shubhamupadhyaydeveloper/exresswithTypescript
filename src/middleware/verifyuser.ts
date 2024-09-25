import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "@/models/user.model";

export const verifyUser = async (req:Request, res:Response, next:NextFunction) => {
  
  try {
    const authHeader = req.headers['authorization']
  
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message : "Access token is required"})
    }
    
    const token = authHeader.split(' ')[1]
    
    const verifyToken = jwt.verify(token,process.env.JWT_TOKEN as string) as {
      userId : string
    }
  
    const userFound = await userModel.findById(verifyToken.userId)
  
    if(!userFound) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  
    req.user = userFound;
    next();
  } catch (err:any) {
      return res.status(401).json({ success: false, message: err.message});
  }
};
 