"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESEND_URL = exports.PORT = exports.JWT_TOKEN = void 0;
const process_1 = require("process");
exports.JWT_TOKEN = process_1.env.JWT_TOKEN;
exports.PORT = process_1.env.PORT;
exports.RESEND_URL = process_1.env.RESEND_URL;
