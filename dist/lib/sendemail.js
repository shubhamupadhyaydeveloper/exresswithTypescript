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
exports.sendEmail = void 0;
const resend_1 = require("resend");
const emailTemplate_1 = require("./emailTemplate");
const resend = new resend_1.Resend("re_fpPNNhHh_Lj6C9s3fos5jvLveUMCi6wsh");
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ title, username, code, email }) {
    const { data, error } = yield resend.emails.send({
        from: "Beatify <donotreply@shubhamupadhyay.online>",
        to: email,
        subject: title,
        html: (0, emailTemplate_1.emailTemplate)({ code, title, username }),
    });
    if (error) {
        return console.log("Error in send Email", error.message);
    }
});
exports.sendEmail = sendEmail;
