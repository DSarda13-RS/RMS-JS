const Joi = require('@hapi/joi')

const authUser = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().alphanum().min(8).required(),
    latitude: Joi.number().min(1).required(),
    longitude: Joi.number().min(1).required()
})

module.exports = {authUser};

