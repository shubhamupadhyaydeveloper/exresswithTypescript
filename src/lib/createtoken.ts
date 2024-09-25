import { Response } from "express"
import jwt from "jsonwebtoken"
import { Types } from "mongoose"

const createToken = async (userId : Types.ObjectId) => {
    try {
     const accessToken = jwt.sign({userId}, process.env.JWT_TOKEN as string, {
        expiresIn : "1h"
     })

     const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN as string,{
         expiresIn : '30d'
     });

     return {accessToken,refreshToken}
    
    } catch (error) {
      console.log("error in createToken")
    }
}

export default createToken