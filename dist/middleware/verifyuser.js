"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const variable_1 = require("../lib/variable");
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = res.cookie;
    if (!token) {
        res.json({ success: "false", message: "Unauthorised user" }).status(401);
    }
    const verifyToken = jsonwebtoken_1.default.verify(token, variable_1.JWT_TOKEN);
    const userFound = yield user_model_1.default.findById(verifyToken.userId);
    if (!userFound) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    req.user = userFound;
    next();
});
exports.verifyUser = verifyUser;
