import {Router} from "express"
import { forgetPassword, loginUser, logout, refreshToken, resetPassword, signUpUser,verifyEmail } from "@/controllers/user.controler"
import { validate } from "@/middleware/validate"
import { loginClientDataType, signUpClientDataType } from "@/validation/user"

const router = Router()

router.get("/logout",logout)
router.post("/signup", validate(signUpClientDataType), signUpUser)
router.post("/login", validate(loginClientDataType), loginUser)
router.post("/verify-email",verifyEmail)
router.post("/forget-password",forgetPassword)
router.post("/forget-password/:token",resetPassword)
router.post("/refresh",refreshToken);

export default router;