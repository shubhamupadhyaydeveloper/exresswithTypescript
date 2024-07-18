import { updateProfile } from '@/controllers/validuser.controler';
// import fileParser from '@/middleware/fileparser';
import {Router} from 'express'
import multer from 'multer';
const storage = multer.memoryStorage()  
const upload = multer({storage:storage})


const router = Router()

router.post("/update-profile" , upload.single("image_url"), updateProfile)

export default router;