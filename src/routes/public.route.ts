import { getSongById } from "@/controllers/public.controler";
import { Router } from "express";

const router = Router()

router.post("/reel",getSongById)

export default router;