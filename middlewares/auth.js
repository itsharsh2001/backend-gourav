import User from "../models/user";
import jwtdecode from "jwt-decode";

export const isAuthorised = async (req, res, next) => {
  try {
    const JWT = req.headers["authorization"].replaceAll("JWT ", "");
    if (isTokenExpired(JWT))
      return res.status(403).json({ message: "Unauthorised" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
