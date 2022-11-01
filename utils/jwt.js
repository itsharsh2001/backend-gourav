import jwt from 'jsonwebtoken'

export const createJwtToken = ( email, tokenversion, id ) => {
    const accesstoken = jwt.sign(
        {
            email: email,
            tokenversion: tokenversion,
            id: id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "0.5h",
        }
    );

    return accesstoken;
}

export const refreshJwtToken = ( email, tokenversion, id ) => {
    const refreshtoken = jwt.sign(
        {
            email: email,
            tokenversion: tokenversion,
            id: id,
        },
        process.env.JWT_SECRET2,
        {
            expiresIn: "7d",
        }
    );

    return refreshtoken;
}