const Joi = require('@hapi/joi')

const authDish = Joi.object({
    name: Joi.string().min(1).required(),
    price: Joi.number().integer().min(1).required()
})

module.exports = {authDish};

