import { Request, Response } from "express";
import userModel from "@/models/user.model";
import bcrypt from "bcrypt";
import createToken from "@/lib/createtoken";
import { sendEmail } from "@/lib/sendemail";

export async function signUpUser(
  req: Request<{}, {}, { username: string; email: string; password: string }>,
  res: Response
) {
  try {
    const { username, email, password } = req.body;

    console.log(username,email,password)

    const userFound = await userModel.findOne({ email, isVerified: false });

    const alreadyVerified = await userModel.findOne({
      email,
      isVerified: true,
    });
   
    if (alreadyVerified) {
      console.log(alreadyVerified)
      return res.status(400).json({ error: "User already verified" });
    }

    const codeGenerator = (): string => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const codeExpiry = new Date();
    codeExpiry.setHours(codeExpiry.getHours() + 1);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (userFound) {
      userFound.password = hashedPassword;
      userFound.username = username;
      userFound.otp = codeGenerator();
      userFound.otpExpiry = codeExpiry;

      await userFound.save();
      sendEmail({ code: userFound.otp, email, title: "Signup", username });
      return res.status(201).json({ message: "check your mail for verification" });
    }

    const createUser = new userModel({
      username,
      email,
      password: hashedPassword,
      otp: codeGenerator(),
      otpExpiry: codeExpiry,
    });

    await createUser.save();

    sendEmail({ code: createUser.otp, email, title: "Signup", username });

    return res.status(201).json({ message: "check your mail for verification" });
  } catch (error: any) {
    console.log("error in sign upUser");
    res.json({ success: false, message: error.message });
  }
}

export async function loginUser(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) {
  try {
    const { email, password } = req.body;
    console.log(email ,password)
    const userFound = await userModel.findOne({ email, isVerified: true });
    

    if (!userFound)
      return res
        .status(404)
        .json({ message: "user not found please verify your email" });

    const matchedPassword = await bcrypt.compare(password, userFound.password);
    if (!matchedPassword)
      return res.status(400).json({ message: "password is incorrect" });

    if (userFound && matchedPassword) {
      createToken(userFound._id, res);
    }

   return res
      .status(200)
      .json({ userDetail: userFound, message: "sign in successful" });
  } catch (error: any) {
    console.log("error in login user", error?.message);
  }
}

export async function logout(req: Request, res: Response) {
  try {
    res.cookie("token", "", { maxAge: 1 });
    res.json({ success: true, message: "logout successful" });
  } catch (error: any) {
    console.log("error in logout", error?.message);
  }
}

export async function verifyEmail(
  req: Request<{}, {}, { otp: string }>,
  res: Response
) {
  try {
    const { otp } = req.body;

    const alreadyVerified = await userModel.findOne({ otp, isVerified: true });
    if (alreadyVerified)
      return res.status(200).json({ message: "user is already verified" });

    const userFound = await userModel.findOne({ otp });
    if (!userFound) return res.status(404).json({ message: "user not found" });

    const notExpired = new Date(userFound.otpExpiry) > new Date();

    if (!notExpired)
      return res
        .status(400)
        .json({ message: "code time is expired try again" });

    if (userFound && notExpired) {
      userFound.isVerified = true;
      userFound.otpExpiry = new Date(0);
      userFound.otp = "null";

      await userFound.save();

      return res.status(200).json({ message: "user verified successful" });
    }
  } catch (error: any) {
    console.log("error in verifyUser", error?.message);
  }
}

export async function forgetPassword(
  req: Request<{}, {}, { email: string }>,
  res: Response
) {
  try {
    const { email } = req.body;

    const userFound = await userModel.findOne({ email });
    if (!userFound) return res.status(404).json({ message: "user not found" });

    const codeGenerator = (): string => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const codeExpiry = new Date();
    codeExpiry.setHours(codeExpiry.getHours() + 1);

    userFound.forgetCode = codeGenerator();
    userFound.forgetCodeExpiry = codeExpiry;

    await userFound.save();

    sendEmail({
      code: userFound.forgetCode,
      email,
      title: "forget password",
      username: userFound.username,
    });

    return res
      .status(200)
      .json({ message: "check your email for email verify" });
  } catch (error: any) {
    console.log("error in forgetPassword", error?.message);
  }
}

export async function resetPassword(
  req: Request<{ token: string }, {}, { password: string }>,
  res: Response
) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const userFound = await userModel.findOne({ forgetCode: token });
    if (!userFound)
      return res.status(404).json({ message: "invalid token user not found" });

    const codeExpired = new Date(userFound.forgetCodeExpiry) > new Date();
    if (codeExpired)
      return res
        .status(400)
        .json({ message: "code time is expired try again" });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (userFound && codeExpired) {
      userFound.password = hashedPassword;
      userFound.forgetCode = "";
      userFound.forgetCodeExpiry = new Date(0);

      await userFound.save();

      res.status(201).json({ message: "password update successful" });
    }
  } catch (error: any) {
    console.log("error in resetPassword", error?.message);
  }
}
