const Joi = require('@hapi/joi')

const authRestaurant = Joi.object({
    name: Joi.string().min(1).required(),
    latitude: Joi.number().min(1).required(),
    longitude: Joi.number().min(1).required()
})

module.exports = {authRestaurant};

