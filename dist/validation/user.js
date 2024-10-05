"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginClientDataType = exports.signUpClientDataType = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signUpClientDataType = joi_1.default.object({
    username: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    method: joi_1.default.string().valid("manual", "google").required(),
    userDeviceToken: joi_1.default.string().optional()
});
exports.loginClientDataType = joi_1.default.object({
    password: joi_1.default.string().required(),
    email: joi_1.default.string().email().required()
});
