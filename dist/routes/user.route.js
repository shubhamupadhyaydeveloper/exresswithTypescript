"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controler_1 = require("../controllers/user.controler");
const router = (0, express_1.Router)();
router.post("/signup", user_controler_1.signUpUser);
router.post("/login", user_controler_1.loginUser);
router.get("/logout", user_controler_1.logout);
exports.default = router;
