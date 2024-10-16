
import express from "express";
import userRoute from "@/routes/user.route";
import validUserRoute from "@/routes/validuser.route";
import publicRoute from "@/routes/public.route";
import registetTokenRoute from "@/routes/notification.route"
import shareLinkRoute from '@/routes/share.route'
import "dotenv/config";
import cookieParser from "cookie-parser";
import { connectedToMongodb } from "@/lib/mongo.connect";
import path from 'path'


const app = express();
const port = process.env.PORT || 3000;

// connect To mongodb
connectedToMongodb();

app.use(express.json());
app.use(cookieParser());


app.use(express.static("public"));
app.use("/auth", userRoute);
app.use("/user", validUserRoute);
app.use("/public", publicRoute);
app.use("/notification",registetTokenRoute)
app.use("/sharelink",shareLinkRoute);

 
app.get("/", (req, res) => {
  res.json({ message: "welcome to my website" });
});

app.listen(port, () => console.log(`port is listining ${port}`));

  