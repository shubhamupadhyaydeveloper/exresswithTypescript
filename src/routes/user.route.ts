import {Router} from "express"
import { loginUser, logout, signUpUser } from "../controllers/user.controler"

const router = Router()

router.post("/signup",signUpUser)
router.post("/login",loginUser)
router.get("/logout",logout)

export default router;