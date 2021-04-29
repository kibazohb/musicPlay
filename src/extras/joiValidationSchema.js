const Joi = require('@hapi/joi')

const registerAuthSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().lowercase().required(),
    lastName: Joi.string().lowercase().required(),
})

module.exports = {
    registerAuthSchema
}