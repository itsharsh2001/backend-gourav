import User from "../models/user.js";
import Otp from "../models/Otp.js";
import { comparePassword, hashPassword } from "../utils/auth.js";
import { createJwtToken, refreshJwtToken, verifyToken } from "../utils/jwt.js";
import OtpGenerator from "otp-generator";
import crypto from "crypto";

var emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "Fill all the Fields" });

    if (username.length < 3)
      return res.status(400).json({ message: "Invalid Name" });

    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid E-Mail Address" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must have atleast 6 characters" });

    if (password != confirmPassword)
      return res.status(400).json({ message: "Password Doesn't match" });

    let checkUser = await User.findOne({ email });

    if (checkUser)
      return res.status(400).json({ message: "User already registered" });

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    let otp = OtpGenerator.generate(6, {
      alphabets: false,
      specialChars: false,
      upperCase: false,
    });

    const newOtp = await Otp.create({ email: user._id, otp });

    return res.status(201).json({ message: user, newOtp });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Try again" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Fill all the Fields" });

    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Enter Valid Email" });

    let checkUser = await User.findOne({ email: email });

    if (!checkUser)
      return res.status(400).json({ message: "User Not Registered" });

    const passwordMatch = await comparePassword(password, checkUser.password);

    if (!passwordMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    if (!checkUser.isVerified)
      return res.status(400).josn({ message: "Verify Your Email" });
    const accesstoken = createJwtToken(
      email,
      checkUser.tokenVersion,
      checkUser._id,
      checkUser.role
    );

    const refreshtoken = refreshJwtToken(
      email,
      checkUser.tokenVersion,
      checkUser._id,
      checkUser.role
    );

    checkUser.password = undefined;

    return res.status(200).json({
      message: checkUser,
      refreshtoken,
      accesstoken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error. Try again");
  }
};

export const logout = async (req, res) => {
  try {
    const JWT = req.headers["authorization"].replaceAll("JWT ", "");
    const tokenDetails = verifyToken(JWT, process.env.JWT_SECRET2);
    if (!tokenDetails) return res.status(403).json({ message: "Unauthorised" });

    await User.findByIdAndUpdate(tokenDetails.id, {
      tokenVersion: tokenDetails.tokenVersion + 1,
    });

    return res.json({ message: "signout success" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error. Try again");
  }
};

export const verifyOtp = async (req, res) => {
  if (!req.body.email || !req.body.otp)
    return res.status(400).json({ message: "Insufficient Fields" });

  const isOtpExist = await Otp.findOne({ email: req.body.email });

  if (!isOtpExist) return res.status(400).json({ message: "otp Expired" });
  if (isOtpExist.otp !== req.body.otp)
    return res.status(400).json({ message: "Wrong Otp" });

  await User.findByIdAndUpdate(req.body.email, { isVerified: true });
  await Otp.findByIdAndDelete(isOtpExist._id);

  res.status(200).json({ message: "done" });
};

export const resendOtp = async (req, res) => {
  if (!req.body.email)
    return res.status(400).json({ message: "Email not sent" });

  const isOtpExist = await Otp.findOne({ email: req.body.email });

  if (isOtpExist)
    return res
      .status(400)
      .json({ message: "Otp has been sent to the mail", isOtpExist });

  let otp = OtpGenerator.generate(6, {
    alphabets: false,
    specialChars: false,
    upperCase: false,
  });

  let newOtp = await Otp.create({ email: req.body.email, otp });
  return res.status(201).json({ message: newOtp });
};

export const forgotPassword = async (req, res) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) console.log(err);

    const resetToken = buffer.toString("hex");
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(422).json({ message: "User does not exist" });
    await User.findByIdAndUpdate(user._id, {
      resetToken,
      expireToken: Date.now() + 3600000,
    });

    return res.status(200).json({ message: "Check Your Mail" });
  });
};

export const updatePassword = async (req, res) => {
  const { password, token } = req.body;

  if (password.length <= 6)
    return res
      .status(400)
      .json({ message: "Password Length should be more than 6 characters" });

  const user = await User.findOne({
    resetToken: token,
    expireToken: { $gt: Date.now() },
  });

  if (!user) return res.status(422).json({ message: "Link is expired" });
  const hashedPassword = await hashPassword(password);
  await User.findByIdAndUpdate(user._id, {
    resetToken: "",
    expireToken: "",
    password: hashedPassword,
  });

  return res.status(200).json({ message: "Password Updated successfully" });
};
