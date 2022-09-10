const Joi = require('@hapi/joi')

const authRestaurantUpdate = Joi.object({
    name: Joi.string().min(1),
    latitude: Joi.number().min(1),
    longitude: Joi.number().min(1)
})

module.exports = {authRestaurantUpdate};

