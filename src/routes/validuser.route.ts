import { createAudio, updateProfile,createPlaylist, updatePlaylist } from "@/controllers/validuser.controler";
import { validate } from "@/middleware/validate";
import { verifyUser } from "@/middleware/verifyuser";
import { playlistClientDataType, updatePlaylistClientDataType } from "@/validation/playlist";
import { Router } from "express";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const router = Router();

router.post("/update-profile",verifyUser, upload.single("image_url"), updateProfile);
router.post(
  "/create-song",
  verifyUser,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createAudio
);

router.post("/create-playlist",verifyUser, validate(playlistClientDataType) , createPlaylist)
router.post("/update-playlist",verifyUser, upload.single('image_url'), validate(updatePlaylistClientDataType),updatePlaylist)

export default router;
