"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.songClientSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.songClientSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    about: joi_1.default.string().required(),
    category: joi_1.default.string().valid("Romantic", "Classic", "Modern", "Punjabi", "English", "Rap"),
    singer: joi_1.default.string().required(),
});
