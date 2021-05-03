const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const client = require('../config/redis')

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

    verifyAccessTokens: (req, res, next)=>{
        if(!req.headers['authorization']) return next(createError.Unauthorized('missing headers'))

        const header = req.headers['authorization']
        const bearerToken = header.split(' ')
        const token = bearerToken[1]

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET + ' ', (err, payload)=>{
            if(!err){
                console.log(payload);
                req.payload = payload
                next()
            }else{
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }
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
                    client.SET(userID, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                        if (err) {
                            console.log(err.message);
                            rej(createError.InternalServerError())
                            return;
                        }
                        res(token)
                    })
                }
            })
        })
    }, 

    verifyRefreshTokens : (refreshToken) => {
        return new Promise((resolve, reject)=>{
            const secret = process.env.REFRESH_TOKEN_SECRET

            JWT.verify(refreshToken, secret, (err, payload) =>{
                if(!err){
                    const userID = payload.aud
                    client.get(userID, (err, res) => {
                        if (err) {
                            console.log(err.message);
                            reject(createError.InternalServerError())
                            return;
                        } else {
                            if (refreshToken === res) {
                                return resolve(userID)
                            } else {
                                reject(createError.Unauthorized())
                            }
                        }
                    })
                }else{
                    console.log(err.message);
                    rej(createError.Unauthorized())
                }
            })
        })
    }
}