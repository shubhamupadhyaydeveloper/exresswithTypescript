"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.songModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const songSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    about: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    thumbnail: {
        type: Object,
        secure_url: String,
        public_id: String,
        required: true
    },
    video: {
        type: Object,
        secure_url: String,
        public_id: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Romantic", "Classic", "Modern", "Punjabi", "English", "Rap"],
        required: true
    },
    likes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }],
    singer: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.songModel = mongoose_1.default.model("Song", songSchema);
