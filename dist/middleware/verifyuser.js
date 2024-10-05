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
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const header = req.headers["authorization"];
        if (!header)
            return res.status(400).json({ message: "access token is required" });
        const token = header === null || header === void 0 ? void 0 : header.split(" ")[1];
        const { userId } = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN);
        const userFound = yield user_model_1.default.findById(userId);
        if (!userFound)
            return res.status(404).json({ message: "Invalid token , try login again" });
        console.log('someone call this', userFound);
        req.user = userFound;
        next();
    }
    catch (error) {
        res
            .status(401)
            .json({ message: `error in verifyuser middleware ${error === null || error === void 0 ? void 0 : error.message}` });
    }
});
exports.verifyUser = verifyUser;
