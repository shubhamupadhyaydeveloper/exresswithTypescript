import express from 'express'
import userRoute from "@/routes/user.route"
import blogRoute from "@/routes/blog.route"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import { connectedToMongodb } from '@/lib/mongo.connect'

const app = express()
const port = process.env.PORT 

// connect To mongodb
connectedToMongodb()

app.use(express.json())
app.use(cookieParser())

app.use("/user",userRoute) 
app.use("/blog",blogRoute)

app.get("/",(req,res) => {
 res.json({message : "welcome to my website"})
})

app.listen(port,() => console.log(`port is listining ${port}`))