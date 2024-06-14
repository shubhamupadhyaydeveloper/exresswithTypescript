import mongoose from "mongoose";

export async function connectedToMongodb() {
    try {
     const connect = await mongoose.connect(process.env.MONGO_URL!)
     console.log("mongodb Connected")
    } catch (error:any) {
        console.log("error in mongodb",error)
    }
}