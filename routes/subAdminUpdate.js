const express = require("express");
const router = express.Router();

const {authenticateToken} = require('../middleware/authenticate')

const {checkSubAdmin} = require('../middleware/checkRole')

const {
    authenticateDetailsUpdate,
    authenticateRestaurantUpdate,
    authenticateDishUpdate
} = require("../middleware/authBody");

const {
    updateDetails
} = require("../controllers/allUser");

const {
    updateRestaurant
} = require('../controllers/restaurant');

const {
    updateDish
} = require('../controllers/dish');

router.use(authenticateToken)
router.use(checkSubAdmin)
router.put('/details',authenticateDetailsUpdate,updateDetails)
router.put('/restaurant/:rId',authenticateRestaurantUpdate,updateRestaurant)
router.put('/dish/:rId/:dId',authenticateDishUpdate,updateDish)

module.exports = router

