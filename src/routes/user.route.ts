import {Router} from "express"
import { loginUser, logout, signUpUser } from "@/controllers/user.controler"
import { validate } from "@/middleware/validate"
import { loginClientDataType, signUpClientDataType } from "@/validation/user"

const router = Router()

router.post("/signup", validate(signUpClientDataType), signUpUser)
router.post("/login", validate(loginClientDataType), loginUser)
router.get("/logout",logout)

export default router;