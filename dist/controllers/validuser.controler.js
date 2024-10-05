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
exports.userDetail = exports.userHistory = exports.toggleFollowAndUnfollow = exports.playlistByProfile = exports.deletePlaylist = exports.updatePlaylist = exports.togglePlaylist = exports.createPlaylist = exports.createAudio = exports.updateProfile = void 0;
const cloudinaryconfig_1 = __importDefault(require("../lib/cloudinaryconfig"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const song_model_1 = require("../models/song.model");
const song_1 = require("../validation/song");
const playlist_model_1 = require("../models/playlist.model");
const history_model_1 = __importDefault(require("../models/history.model"));
const sharp_1 = __importDefault(require("sharp"));
function updateProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            if (!((_a = req.headers["content-type"]) === null || _a === void 0 ? void 0 : _a.startsWith("multipart/form-data")))
                return res.status(422).json({ message: "only form-data is allowed" });
            const user = req.user;
            const userFound = yield user_model_1.default.findOne({ email: user === null || user === void 0 ? void 0 : user.email });
            if (!userFound)
                return res.status(400).json({ message: "user not found" });
            const { username, password } = req.body;
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const arrayBuffer = (_b = req.file) === null || _b === void 0 ? void 0 : _b.buffer;
            const buffer = new Uint8Array(arrayBuffer);
            if (req === null || req === void 0 ? void 0 : req.file) {
                // delete previous file
                cloudinaryconfig_1.default.uploader.destroy(userFound.profileImage.public_id);
                const result = yield new Promise((resolve, reject) => {
                    cloudinaryconfig_1.default.uploader
                        .upload_stream({
                        width: 300,
                        height: 300,
                        crop: "thumb",
                        gravity: "force",
                    }, function (error, result) {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve({
                            secure_url: result === null || result === void 0 ? void 0 : result.secure_url,
                            public_id: result === null || result === void 0 ? void 0 : result.public_id,
                        });
                    })
                        .end(buffer);
                });
                userFound.profileImage.secure_url = (result === null || result === void 0 ? void 0 : result.secure_url) || "";
                userFound.profileImage.public_id = (result === null || result === void 0 ? void 0 : result.public_id) || "";
                yield userFound.save();
            }
            userFound.password = hashedPassword || userFound.password;
            userFound.username = username || userFound.username;
            yield userFound.save();
            res
                .status(201)
                .json({ uploaded: true, message: "userproflie updated successful" });
        }
        catch (error) {
            res
                .status(500)
                .json({ message: `error in update profile ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.updateProfile = updateProfile;
function createAudio(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            if (!((_a = req.headers["content-type"]) === null || _a === void 0 ? void 0 : _a.startsWith("multipart/form-data")))
                return res.status(422).json({ message: "only form-data is allowed" });
            const currentUser = req.user;
            const files = req.files;
            const { error, value } = song_1.songClientSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            const { title, about, category, singer } = value;
            if (!files.video)
                return res
                    .status(400)
                    .json({ message: "audio is required for create song" });
            const createSong = new song_model_1.songModel({
                title,
                about,
                owner: currentUser._id,
                category,
                singer,
            });
            yield createSong.save();
            if (files.thumbnail) {
                if (((_b = files.thumbnail[0]) === null || _b === void 0 ? void 0 : _b.size) > 1 * 1024 * 1024) {
                    return res
                        .status(400)
                        .json({ message: "Thumbnail image size must be less than 1MB" });
                }
                const arrayBuffer = (_c = files.thumbnail[0]) === null || _c === void 0 ? void 0 : _c.buffer;
                const uploadStream = cloudinaryconfig_1.default.uploader.upload_stream({
                    transformation: {
                        quality: "auto:low",
                        format: "webp",
                    },
                }, function (error, result) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            return res
                                .status(500)
                                .json({ message: "Error uploading to Cloudinary", error });
                        }
                        createSong.thumbnail.public_id = (result === null || result === void 0 ? void 0 : result.public_id) || "";
                        createSong.thumbnail.secure_url = (result === null || result === void 0 ? void 0 : result.secure_url) || "";
                    });
                });
                (0, sharp_1.default)(arrayBuffer)
                    .resize(1024)
                    .webp({ quality: 40 })
                    .pipe(uploadStream)
                    .on("error", (error) => {
                    console.error("Error processing image:", error);
                    res.status(500).json({ message: "Error processing image", error });
                });
            }
            if (files.video) {
                const arrayBuffer = (_d = files.video[0]) === null || _d === void 0 ? void 0 : _d.buffer;
                const buffer = new Uint8Array(arrayBuffer);
                const result = yield new Promise((resolve, reject) => {
                    cloudinaryconfig_1.default.uploader
                        .upload_stream({
                        resource_type: "auto",
                        transformation: {
                            quality: "auto",
                        },
                    }, function (error, result) {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve({
                            secure_url: result === null || result === void 0 ? void 0 : result.secure_url,
                            public_id: result === null || result === void 0 ? void 0 : result.public_id,
                        });
                    })
                        .end(buffer);
                });
                createSong.video.public_id = (result === null || result === void 0 ? void 0 : result.public_id) || "";
                createSong.video.secure_url = (result === null || result === void 0 ? void 0 : result.secure_url) || "";
            }
            yield createSong.save();
            res.status(201).json({ videoUploaded: true, thumbnailUploaded: true });
        }
        catch (error) {
            res.status(500).json({ message: `error in creatsong ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.createAudio = createAudio;
function createPlaylist(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title, owner, songId, visibilty } = req.body;
            const userFound = yield user_model_1.default.findById(owner);
            if (!userFound)
                return res.status(404).json({ message: "user not found" });
            const createPlaylist = new playlist_model_1.playlistModel({
                title,
                owner,
                songs: [songId],
                visibility: visibilty,
            });
            yield createPlaylist.save();
            userFound.playlist.push(createPlaylist._id);
            yield userFound.save();
            res.status(201).json({ message: "playlist created" });
        }
        catch (error) {
            res
                .status(500)
                .json({ message: `error in create playlist ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.createPlaylist = createPlaylist;
function togglePlaylist(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { songId, playlistId } = req.body;
            const currentUser = req.user;
            const findPlayist = yield playlist_model_1.playlistModel.findById(playlistId);
            if (!findPlayist)
                return res.status(404).json({ message: "Playlist not found" });
            const alreadyAdded = findPlayist.songs.includes(songId);
            if (alreadyAdded) {
                // remove song
                yield playlist_model_1.playlistModel.updateOne({ _id: playlistId }, { $pull: { songs: songId } });
                res.status(200).json({ message: "song removed" });
            }
            else {
                // add song
                yield playlist_model_1.playlistModel.updateOne({ _id: playlistId }, { $addToSet: { songs: songId } });
                res.status(200).json({ message: "song added" });
            }
        }
        catch (error) {
            res
                .status(500)
                .json({ message: `error in toggleplaylist ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.togglePlaylist = togglePlaylist;
function updatePlaylist(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title, visibility, playlistId } = req.body;
            const playlistFound = yield playlist_model_1.playlistModel.findById(playlistId);
            if (!playlistFound)
                return res.status(404).json({ message: "playlist not found" });
            (playlistFound.title = title || playlistFound.title),
                (playlistFound.visibility = visibility || playlistFound.visibility);
            yield playlistFound.save();
            return res.status(201).json({ message: "update playlist successful" });
        }
        catch (error) {
            res
                .status(500)
                .json({ message: `error in updateplaylist ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.updatePlaylist = updatePlaylist;
function deletePlaylist(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { playlistId } = req.body;
            const currentUser = req.user;
            const playlistFound = yield playlist_model_1.playlistModel.findById(playlistId);
            if (!playlistFound)
                return res.status(404).json({ message: "playlist not found" });
            yield playlist_model_1.playlistModel.findByIdAndDelete(playlistId);
            yield user_model_1.default.updateOne({ _id: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id }, { $pull: { playlist: playlistId } });
            return res.status(201).json({ message: "delete playlist successful" });
        }
        catch (error) {
            res
                .status(500)
                .json({ message: `error in deletePlaylist ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.deletePlaylist = deletePlaylist;
function playlistByProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentUser = req.user;
            const findPlayist = yield playlist_model_1.playlistModel
                .find({ owner: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id })
                .populate("songs");
            return res.status(201).json({ playlists: findPlayist });
        }
        catch (error) {
            res
                .status(500)
                .json({ message: `error in playlist by profile ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.playlistByProfile = playlistByProfile;
// follow and unfollow
function toggleFollowAndUnfollow(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentUser = req.user;
            const { secondUserId } = req.body;
            const secondUser = yield user_model_1.default.findById(secondUserId);
            const isFollowing = currentUser === null || currentUser === void 0 ? void 0 : currentUser.followers.includes(currentUser === null || currentUser === void 0 ? void 0 : currentUser._id);
            if (isFollowing) {
                // unfollow
                yield user_model_1.default.updateOne({ _id: secondUserId }, { $pull: { following: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id } });
                yield user_model_1.default.updateOne({ _id: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id }, { $pull: { followers: secondUserId } });
                return res.status(200).json({ message: "user unfollow successful" });
            }
            else {
                // follow user
                yield user_model_1.default.updateOne({ _id: secondUserId }, { $addToSet: { following: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id } });
                yield user_model_1.default.updateOne({ _id: currentUser === null || currentUser === void 0 ? void 0 : currentUser._id }, { $addToSet: { followers: secondUserId } });
                return res.status(200).json({ message: "user follow successful" });
            }
        }
        catch (error) {
            res
                .status(500)
                .json({ message: `error in toggle follow and unfollow ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.toggleFollowAndUnfollow = toggleFollowAndUnfollow;
function userHistory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, songId, progress } = req.body;
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const existingPlay = yield history_model_1.default.findOneAndUpdate({ userId, songId, date: { $gt: thirtyDaysAgo } }, { $set: { date: new Date(), progress } }, { new: true });
            if (!existingPlay) {
                const createPlay = new history_model_1.default({ userId, songId, progress });
                yield createPlay.save();
            }
            yield history_model_1.default.deleteMany({
                userId,
                timestamp: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            });
        }
        catch (error) {
            res.status(500).json({ message: `error in updatehistory ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.userHistory = userHistory;
function userDetail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.body;
            const user = yield user_model_1.default.findById(userId);
            if (!user)
                return res.status(500).json({ message: "user not found invalid userId" });
            return res.status(200).json(user);
        }
        catch (error) {
        }
    });
}
exports.userDetail = userDetail;
