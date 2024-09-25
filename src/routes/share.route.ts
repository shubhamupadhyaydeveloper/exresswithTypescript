import { Router } from "express";
import {shareLogic} from '@/controllers/share.controler'

const router = Router();

router.get("/:type/:id",shareLogic)

export default router;
