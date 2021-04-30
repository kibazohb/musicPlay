const JWT = require('jsonwebtoken')
const createError = require('http-errors')

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
    },

    refreshTokens: (userID) =>{
        return new Promise((res, rej) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {expiresIn: "1y", audience: userID}

            JWT.sign(payload, secret, options, (err, token)=>{
                if(err){
                    console.log(err.message);
                    rej(createError.InternalServerError())
                }else{
                    res(token)
                }
            })
        })
    }, 

    verifyRefreshTokens : (userID) => {
        return new Promise()
    }
}