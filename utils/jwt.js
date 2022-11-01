import jwt from "jsonwebtoken";

export const createJwtToken = (email, tokenVersion, id) => {
  const accesstoken = jwt.sign(
    {
      email: email,
      tokenVersion: tokenVersion,
      id: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "0.5h",
    }
  );

  return accesstoken;
};

export const refreshJwtToken = (email, tokenVersion, id) => {
  const refreshtoken = jwt.sign(
    {
      email: email,
      tokenVersion: tokenVersion,
      id: id,
    },
    process.env.JWT_SECRET2,
    {
      expiresIn: "7d",
    }
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
