"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlaylistClientDataType = exports.playlistClientDataType = void 0;
const joi_1 = __importDefault(require("joi"));
exports.playlistClientDataType = joi_1.default.object({
    title: joi_1.default.string().required(),
    owner: joi_1.default.string().required(),
    songs: joi_1.default.array().items(joi_1.default.string()),
    visibility: joi_1.default.string().valid("Public", "Private")
});
exports.updatePlaylistClientDataType = joi_1.default.object({
    title: joi_1.default.string().required(),
    visibility: joi_1.default.string().valid("Public", "Private")
});
