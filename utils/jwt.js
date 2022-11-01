import jwt from 'jsonwebtoken'

export const createJwtToken = ( email, tokenVersion, id ) => {
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
}

export const refreshJwtToken = ( email, tokenVersion, id ) => {
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
}

export const verifyToken = (token) => {
    // var decoded = jwt.verify(token, process.env.JWT_SECRET2);
    // console.log(decoded);
    try {
        jwt.verify(token, process.env.JWT_SECRET2, function(err, decoded) {
            // console.log(decoded.foo) // bar
            if(err)
                return false;
            return true;
        });
    } catch (error) {
        
    }


    

    
}