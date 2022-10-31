// import { Jwt } from "jsonwebtoken"; this line doesnt work for jsonwebtoken since it is a commonJS module
// import pkg from 'jsonwebtoken';
// const { Jwt } =pkg

import jwt from 'jsonwebtoken'

export const createJwtToken = ( email ) => {
    const token = jwt.sign(
        {
            email: email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );

    return token;
}