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
exports.resetPassword = exports.forgetPassword = exports.verifyEmail = exports.logout = exports.refreshToken = exports.loginUser = exports.signUpUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createtoken_1 = __importDefault(require("../lib/createtoken"));
const sendemail_1 = require("../lib/sendemail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function signUpUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, email, password, method, userDeviceToken } = req.body;
            console.log(username, email);
            const alreadyVerified = yield user_model_1.default.findOne({
                email,
                isVerified: true,
            });
            if (alreadyVerified) {
                console.log(alreadyVerified);
                return res.status(400).json({ error: "User already verified" });
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            if (method === "google") {
                const createUser = yield user_model_1.default.create({
                    username,
                    email,
                    password: hashedPassword,
                    otpExpiry: new Date(0),
                    otp: "null",
                    isVerified: true,
                    authMethod: "google",
                    userDeviceToken: userDeviceToken !== null && userDeviceToken !== void 0 ? userDeviceToken : ""
                });
                yield createUser.save();
                const token = yield (0, createtoken_1.default)(createUser._id);
                return res.status(201).json({
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken,
                    userId: createUser._id,
                    message: "sign up succesful",
                });
            }
            const userFound = yield user_model_1.default.findOne({ email, isVerified: false });
            const codeGenerator = () => {
                return Math.floor(100000 + Math.random() * 900000).toString();
            };
            const codeExpiry = new Date();
            codeExpiry.setHours(codeExpiry.getHours() + 1);
            if (userFound) {
                userFound.password = hashedPassword;
                userFound.username = username;
                userFound.otp = codeGenerator();
                userFound.otpExpiry = codeExpiry;
                yield userFound.save();
                (0, sendemail_1.sendEmail)({ code: userFound.otp, email, title: "Signup", username });
                return res
                    .status(201)
                    .json({ message: "check your mail for verification" });
            }
            const createUser = new user_model_1.default({
                username,
                email,
                password: hashedPassword,
                otp: codeGenerator(),
                otpExpiry: codeExpiry,
                authMethod: "manual",
                userDeviceToken: userDeviceToken !== null && userDeviceToken !== void 0 ? userDeviceToken : "",
            });
            yield createUser.save();
            (0, sendemail_1.sendEmail)({ code: createUser.otp, email, title: "Signup", username });
            return res
                .status(201)
                .json({ message: "check your mail for verification" });
        }
        catch (error) {
            res.status(500).json({ message: `error in signup user ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.signUpUser = signUpUser;
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const userFound = yield user_model_1.default.findOne({ email, isVerified: true });
            if (!userFound)
                return res
                    .status(404)
                    .json({ message: "user not found please verify your email" });
            const matchedPassword = yield bcrypt_1.default.compare(password, userFound.password);
            if (!matchedPassword)
                return res.status(400).json({ message: "password is incorrect" });
            if (userFound && matchedPassword) {
                const token = yield (0, createtoken_1.default)(userFound._id);
                return res.status(200).json({
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken,
                    userId: userFound._id,
                });
            }
        }
        catch (error) {
            res
                .status(500)
                .json({ message: `error in login user  ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.loginUser = loginUser;
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken)
                res.status(400).json({ message: "refresh token is required" });
            console.log(refreshToken);
            const { userId } = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN);
            const findUser = yield user_model_1.default.findById(userId);
            if (!findUser)
                return res.status(400).json({ message: "invalid refresh token" });
            const token = yield (0, createtoken_1.default)(findUser._id);
            return res.status(200).json({
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            });
        }
        catch (error) {
            res
                .status(500)
                .json({ message: `error in refresh token ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.refreshToken = refreshToken;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.cookie("token", "", { maxAge: 1 });
            res.json({ success: true, message: "logout successful" });
        }
        catch (error) {
            res.status(500).json({ message: `error in logout ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.logout = logout;
function verifyEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { otp } = req.body;
            const alreadyVerified = yield user_model_1.default.findOne({ otp, isVerified: true });
            if (alreadyVerified)
                return res.status(200).json({ message: "user is already verified" });
            const userFound = yield user_model_1.default.findOne({ otp });
            if (!userFound)
                return res.status(404).json({ message: "user not found" });
            const notExpired = new Date(userFound.otpExpiry) > new Date();
            if (!notExpired)
                return res
                    .status(400)
                    .json({ message: "code time is expired try again" });
            if (userFound && notExpired) {
                userFound.isVerified = true;
                userFound.otpExpiry = new Date(0);
                userFound.otp = "null";
                yield userFound.save();
                return res.status(200).json({ message: "user verified successful" });
            }
        }
        catch (error) {
            res.status(500).json({ message: `error in verify user  ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.verifyEmail = verifyEmail;
function forgetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const userFound = yield user_model_1.default.findOne({ email });
            if (!userFound)
                return res.status(404).json({ message: "user not found" });
            const codeGenerator = () => {
                return Math.floor(100000 + Math.random() * 900000).toString();
            };
            const codeExpiry = new Date();
            codeExpiry.setHours(codeExpiry.getHours() + 1);
            userFound.forgetCode = codeGenerator();
            userFound.forgetCodeExpiry = codeExpiry;
            yield userFound.save();
            (0, sendemail_1.sendEmail)({
                code: userFound.forgetCode,
                email,
                title: "forget password",
                username: userFound.username,
            });
            return res
                .status(200)
                .json({ message: "check your email for email verify" });
        }
        catch (error) {
            res.status(500).json({ message: `error in forgot password  ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.forgetPassword = forgetPassword;
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = req.params;
            const { password } = req.body;
            const userFound = yield user_model_1.default.findOne({ forgetCode: token });
            if (!userFound)
                return res.status(404).json({ message: "invalid token user not found" });
            const codeExpired = new Date(userFound.forgetCodeExpiry) > new Date();
            if (codeExpired)
                return res
                    .status(400)
                    .json({ message: "code time is expired try again" });
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            if (userFound && codeExpired) {
                userFound.password = hashedPassword;
                userFound.forgetCode = "";
                userFound.forgetCodeExpiry = new Date(0);
                yield userFound.save();
                res.status(201).json({ message: "password update successful" });
            }
        }
        catch (error) {
            res.status(500).json({ message: `error in reset password ${error === null || error === void 0 ? void 0 : error.message}` });
        }
    });
}
exports.resetPassword = resetPassword;
