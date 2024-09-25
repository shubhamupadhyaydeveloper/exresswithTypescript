import { registerToken, sendNotification } from "@/controllers/notification.controler";
import { Router } from "express";

const router = Router();

router.post("/send",sendNotification)
router.post("/register",registerToken)

export default router;
