"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const public_controler_1 = require("../controllers/public.controler");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/reel", public_controler_1.getSongById);
exports.default = router;
