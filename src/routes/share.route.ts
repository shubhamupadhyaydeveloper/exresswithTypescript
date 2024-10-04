import { shareLink } from "@/controllers/share.controler";
import { Router } from "express";

const router = Router();

router.get("/:type/:id",shareLink)

export default router;
