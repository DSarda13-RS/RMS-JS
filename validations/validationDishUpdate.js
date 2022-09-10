const Joi = require('@hapi/joi')

const authDishUpdate = Joi.object({
    name: Joi.string().min(1),
    price: Joi.number().integer().min(1)
})

module.exports = {authDishUpdate};

