"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const share_controler_1 = require("../controllers/share.controler");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/:type/:id", share_controler_1.shareLink);
exports.default = router;
