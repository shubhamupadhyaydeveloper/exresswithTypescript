import { accessTokenTest, registerNotification, sendNotification } from "@/controllers/notification.controler";
import { verifyUser } from "@/middleware/verifyuser";
import { Router } from "express";

const router = Router()

router.post("/register",registerNotification)
router.post("/send",sendNotification)
router.get("/test", verifyUser, accessTokenTest);

export default router