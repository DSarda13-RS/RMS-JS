const Joi = require('@hapi/joi')

const authLocation = Joi.object({
    latitude: Joi.number().min(1).required(),
    longitude: Joi.number().min(1).required()
})

module.exports = {authLocation};

