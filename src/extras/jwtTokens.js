const JWT = require('jsonwebtoken')

module.exports = {
    signinAccessToken: (userID)=>{
        return new Promise((res, rej)=>{
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET,
            const options = {expiresIn: '3d', audience: userID}

            JWT.sign(payload, secret, options, (err, token)=>{
                if(err){
                    console.log(err.message);
                    rej(createError.InternalServerError())
                }else{
                    res(token)
                }
            })
        })
    }
}