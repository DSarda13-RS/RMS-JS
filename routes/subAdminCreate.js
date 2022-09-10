const express = require("express");
const router = express.Router();

const {authenticateToken} = require('../middleware/authenticate')

const {checkSubAdmin} = require('../middleware/checkRole')

const {
    authenticateUser,
    authenticateRestaurant,
    authenticateDish
} = require('../middleware/authBody')

const {
    createUser
} = require('../controllers/allUser');

const {
    createRestaurant
} = require('../controllers/restaurant');

const {
    createDish
} = require('../controllers/dish');

router.use(authenticateToken)
router.use(checkSubAdmin)
router.post('/restaurant',authenticateRestaurant,createRestaurant)
router.post('/:rId/dish',authenticateDish,createDish)
router.post('/user',authenticateUser,createUser)

module.exports = router

