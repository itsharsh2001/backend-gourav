import User from "../models/user.js";
import { comparePassword, hashPassword } from "../utils/auth.js";
import { createJwtToken } from "../utils/jwt.js";

var emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "Fill all the Fields" });

    //Validate username
    if (username.length < 3) {
      return res.status(400).json({ message: "Invalid Name" });
    }

    //Validate email
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid E-Mail Address" });
    }

    // validate password
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must have atleast 6 characters" });
    }
    if (password != confirmPassword) {
      return res.status(400).json({ message: "Password Doesn't match" });
    }

    // check user exist or not
    let checkUser = await User.findOne({ email: email });

    if (checkUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    //hashing password
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Try again" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate fields
    if (!email || !password) {
      return res.status(400).json({ message: "Fill all the Fields" });
    }

    // validate email
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter Valid Email" });
    }

    // email exist or not
    let checkUser = await User.findOne({ email: email });

    if (!checkUser) {
      return res.status(500).json({ message: "User Not Registered" });
    }

    //matching password
    const passwordMatch = await comparePassword(password, checkUser.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //creating token
    const token = createJwtToken(email);

    // Now Return User and Token to the client.
    checkUser.password = undefined;

    res.cookie("token", token, {
      httpOnly: true, // http - in development
      // secure: true, // only works on https - secure - in production
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error. Try again");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "signout success" });
  } catch (error) {
    console.log(error);
  }
};
