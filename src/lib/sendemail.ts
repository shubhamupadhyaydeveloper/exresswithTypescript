import express, { Request, Response } from "express";
import { Resend } from "resend";
import { RESEND_URL } from "./variable";
import { emailTemplate } from "./emailTemplate";

const resend = new Resend("re_fpPNNhHh_Lj6C9s3fos5jvLveUMCi6wsh");

type sendEmailProps = {
    title: string;
    username : string;
    code: string;
    email : string
}

export const sendEmail = async ({title,username,code,email}:sendEmailProps) =>{
    const { data, error } = await resend.emails.send({
        from: "Beatify <donotreply@shubhamupadhyay.online>",
        to: email,
        subject: title,
        html: emailTemplate({code , title,username}),
      });
    
    if(error) {
        return console.log("Error in send Email", error.message)
    }
}