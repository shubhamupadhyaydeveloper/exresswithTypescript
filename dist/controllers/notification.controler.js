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
exports.registerToken = exports.sendNotification = void 0;
const notification_1 = __importDefault(require("../lib/notification"));
const user_model_1 = __importDefault(require("../models/user.model"));
function sendNotification(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title, description, imageUrl, token } = req.body;
            const message = yield notification_1.default.messaging().send({
                token: token,
                data: {
                    title,
                    description,
                    imageUrl,
                },
            });
            res.status(201).json({ message: "notificaton send successfully" });
        }
        catch (error) {
            res
                .status(500)
                .json({ message: `error in sendNotification, ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.sendNotification = sendNotification;
function registerToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token, userId } = req.body;
            const findUser = yield user_model_1.default.findOne({ userDeviceToken: token });
            if (findUser)
                return res.status(400).json({ message: "token already register" });
            const saveUserToken = yield user_model_1.default.findById(userId);
            if (!saveUserToken)
                return res.status(404).json({ message: "user not found" });
            saveUserToken.userDeviceToken = token;
            yield saveUserToken.save();
            res.status(201).json({ message: "register token successfully" });
        }
        catch (error) {
            res
                .status(500)
                .json({ message: `error in registerNotification, ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.registerToken = registerToken;
