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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSongById = void 0;
const song_model_1 = require("../models/song.model");
const mongoose_1 = require("mongoose");
function getSongById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { songId } = req.body;
            if (!songId)
                return res.status(400).json({ message: "songId is required" });
            if (!(0, mongoose_1.isValidObjectId)(songId))
                return res.status(400).json({ message: "invalid song id" });
            const findSong = yield song_model_1.songModel.findById(songId);
            if (!findSong)
                return res.status(404).json({ message: "song not find invalid song Id" });
            return res.status(200).send(findSong);
        }
        catch (error) {
            res.status(500).json({ message: "error in getSongById " + (error === null || error === void 0 ? void 0 : error.message) });
        }
    });
}
exports.getSongById = getSongById;
