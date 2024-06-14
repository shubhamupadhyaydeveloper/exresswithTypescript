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
exports.logout = exports.loginUser = exports.signUpUser = void 0;
const user_1 = require("../dto/user");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createtoken_1 = __importDefault(require("../lib/createtoken"));
function signUpUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error, value } = user_1.singupScheamJoi.validate(req.body);
            if (error)
                return res
                    .json({ success: false, message: error.details[0].message })
                    .status(400);
            const { username, email, password } = value;
            if (!username || !email || !password)
                return res
                    .json({ success: false, message: "credentials not complete" })
                    .status(400);
            const isUserAlreadyExists = yield user_model_1.default.findOne({ username });
            if (isUserAlreadyExists)
                return res.json({ success: false, message: "user is already created" });
            const hasedPassword = yield bcrypt_1.default.hash(password, 10);
            const newUserCreate = yield user_model_1.default.create({
                username,
                email,
                password: hasedPassword,
            });
            yield newUserCreate.save();
            if (newUserCreate) {
                (0, createtoken_1.default)(newUserCreate._id, res);
                res.json({ success: true, data: newUserCreate });
            }
        }
        catch (error) {
            console.log("error in sign upUser");
            res.json({ success: false, message: error.message });
        }
    });
}
exports.signUpUser = signUpUser;
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error, value } = user_1.loginUserSchemaJoi.validate(req.body);
            if (error) {
                return res
                    .json({ success: false, message: error.details[0].message })
                    .status(400);
            }
            const { email, password } = value;
            const userFound = yield user_model_1.default.findOne({ email });
            if (!userFound)
                return res.status(404).json({ success: false, message: 'User not found' });
            const passwordMatch = yield bcrypt_1.default.compare(password, userFound.password);
            if (!passwordMatch)
                return res.status(401).json({ success: false, message: "credentials are invalid" });
            if (userFound && passwordMatch) {
                (0, createtoken_1.default)(userFound._id, res);
                res.json({ success: true, message: userFound });
            }
        }
        catch (error) {
            console.log("error in login user", error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.loginUser = loginUser;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.cookie("token", "", { maxAge: 1 });
            res.json({ success: true, message: "logout successful" });
        }
        catch (error) {
            console.log("error in logout", error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
exports.logout = logout;
