import User from "../models/user";
import { verifyToken } from "../utils/jwt.js";

export const isAuthorised = async (req, res, next) => {
  try {
    const JWT = req.headers["authorization"].replaceAll("JWT ", "");

    const tokenDetails = verifyToken(JWT, process.env.secret);
    if (!tokenDetails) return res.status(403).json({ message: "Unauthorised" });

    const isUserExist = await User.findById(tokenDetails.id);
    if (!isUserExist) return res.status(403).json({ message: "Unauthorised" });
    req.authUser = tokenDetails.id;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const isAdminAuthorised = async (req, res, next) => {
  try {
    const JWT = req.headers["authorization"].replaceAll("JWT ", "");

    const tokenDetails = verifyToken(JWT, process.env.secret);
    if (!tokenDetails && tokenDetails.role !== "admin")
      return res.status(403).json({ message: "Unauthorised" });

    const isUserExist = await User.findById(tokenDetails.id);
    if (!isUserExist && isUserExist.role !== "admin")
      return res.status(403).json({ message: "Unauthorised" });
    req.authUser = tokenDetails.id;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
