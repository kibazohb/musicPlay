const User = require("../models/User");
const createError = require("http-errors");
const { registerAuthSchema } = require("../extras/joiValidationSchema");
const {
  signinAccessToken,
  refreshTokens,
  verifyRefreshTokens,
} = require("../extras/jwtTokens");
const client = require('../config/redis')

module.exports = {
  register: async (req, res, next) => {
    try {
      const guest = await registerAuthSchema.validateAsync(req.body.user);

      const doesUserExist = await User.findOne({ email: guest.email });

      if (doesUserExist) {
        throw createError.Conflict(
          `${guest.email} has already been registered`
        );
      }

      const newUser = new User(guest);
      const saved = await newUser.save();

      const accessToken = await signinAccessToken(saved.id);
      const refreshToken = await refreshTokens(saved.id);
      res.send({ accessToken, refreshToken });
    } catch (error) {
      // JOI is a powerful schema description language and data validator
      if (error.isJoi) {
        error.status = 422;
      }
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const guest = await registerAuthSchema.validateAsync(req.body.user);

      const foundUser = await User.findOne({ email: guest.email });

      if (!foundUser) {
        throw createError.NotFound(`${guest.email} is not registered`);
      }

      const isPasswordMatching = await foundUser.isValidPassword(
        guest.password
      );

      if (!isPasswordMatching) {
        throw createError.Unauthorized("Invalid Username or Password");
      }

      const accessToken = await signinAccessToken(foundUser.id);
      const refreshToken = await refreshTokens(foundUser.id);
      res.send({ accessToken, refreshToken });
    } catch (err) {
      if (err.isJoi) {
        return next(createError.BadReqest("Invalid Username or Password"));
      }
      next(err);
    }
  },

  refresh: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw createError.BadReqest();
      } else {
        const userID = await verifyRefreshTokens(refreshToken);

        const accessToken = await signinAccessToken(userID);

        const newToken = await refreshTokens(userID);
        console.log({ newToken, accessToken });

        res.send({ accessToken, newToken });
      }
    } catch (err) {
      next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw createError.BadReqest()
      }

      const userID = await verifyRefreshTokens(refreshToken)
      client.DEL(userID, (err, reply) =>{
        if(err){
          console.log(err.message);
          throw createError.InternalServerError()
        }

        res.sendStatus(204)
      })
    } catch (err) {
      next(err);
    }
  },
};
