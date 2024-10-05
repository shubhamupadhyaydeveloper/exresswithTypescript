"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notification_controler_1 = require("../controllers/notification.controler");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/send", notification_controler_1.sendNotification);
router.post("/register", notification_controler_1.registerToken);
exports.default = router;
