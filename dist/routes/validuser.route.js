"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validuser_controler_1 = require("../controllers/validuser.controler");
const validate_1 = require("../middleware/validate");
const playlist_1 = require("../validation/playlist");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = (0, express_1.Router)();
router.post("/update-profile", upload.single("image_url"), validuser_controler_1.updateProfile);
router.post("/create-song", upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
]), validuser_controler_1.createAudio);
router.post("/create-playlist", (0, validate_1.validate)(playlist_1.playlistClientDataType), validuser_controler_1.createPlaylist);
router.post("/update-playlist", (0, validate_1.validate)(playlist_1.updatePlaylistClientDataType), validuser_controler_1.updatePlaylist);
exports.default = router;
