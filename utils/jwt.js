import jwt from "jsonwebtoken";

export const createJwtToken = (email, tokenVersion, id, role) => {
  const accesstoken = jwt.sign(
    { email, tokenVersion, id, role },
    process.env.JWT_SECRET,
    { expiresIn: "0.5h" }
  );

  return accesstoken;
};

export const refreshJwtToken = (email, tokenVersion, id, role) => {
  const refreshtoken = jwt.sign(
    { email, tokenVersion, id, role },
    process.env.JWT_SECRET2,
    { expiresIn: "7d" }
  );

  return refreshtoken;
};

const isTokenExpired = (exp) => Date.now() >= exp * 1000;

export const verifyToken = (token, secret) => {
  try {
    var decoded = jwt.verify(token, secret);
    if (isTokenExpired(decoded)) return decoded;

    return false;
  } catch (error) {
    return false;
  }
};
