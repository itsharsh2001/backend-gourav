import User from "../models/user.js";
import Otp from "../models/Otp.js";
import { comparePassword, hashPassword } from "../utils/auth.js";
import { createJwtToken, refreshJwtToken } from "../utils/jwt.js";
import jwtdecode from "jwt-decode";
import OtpGenerator from "otp-generator";

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

    const newOtp = await Otp.create({ email, otp });

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

    const accesstoken = createJwtToken(
      email,
      checkUser.tokenVersion,
      checkUser._id
    );

    const refreshtoken = refreshJwtToken(
      email,
      checkUser.tokenVersion,
      checkUser._id
    );

    // delete checkUser["password"];
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

const isTokenExpired = (t) => Date.now() >= jwtdecode(t || "null").exp * 1000;

export const logout = async (req, res) => {
  try {
    const JWT = req.headers["authorization"].replaceAll("JWT ", "");
    if (isTokenExpired(JWT))
      return res.status(403).json({ message: "Unauthorised" });

    await User.findByIdAndUpdate(jwtdecode(JWT).id, {
      tokenVersion: jwtdecode(JWT).tokenVersion + 1,
    });

    return res.json({ message: "signout success" });
  } catch (error) {
    return res.status(500).send("Error. Try again");
  }
};

export const verifyOtp = async (req, res) => {
  const isOtpExist = await Otp.findOne({ email: req.body.email });

  if (!isOtpExist) return res.status(400).json({ message: "otp Expired" });
  if (isOtpExist.otp !== req.body.otp)
    return res.status(400).json({ message: "Wrong Otp" });

  await User.findAndUpdate({ email: isOtpExist.email }, { isVerified: true });
  await Opt.findByIdAndDelete(isOtpExist._id);

  res.status(200).json({ message: "done" });
};

export const resendOtp = async (req, res) => {
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

  let newOtp = await Otp.create({ email, otp });
  return res.status(201).json({ message: newOtp });
};
