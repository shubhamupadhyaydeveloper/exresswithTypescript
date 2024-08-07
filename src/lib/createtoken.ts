import { Response } from "express"
import jwt from "jsonwebtoken"
import { Types } from "mongoose"
import { JWT_TOKEN } from "./variable"

const createToken = async (userId : Types.ObjectId,res:Response) => {
    try {
     const token = jwt.sign({userId},JWT_TOKEN!, {
        expiresIn : "15d"
     })

     res.cookie("token",token,{
        maxAge: 15 * 24 * 60 * 60 * 1000, 
        httpOnly : true
     })

     return token
    } catch (error) {
      console.log("error in createToken")
    }
}

export default createToken