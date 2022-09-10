const express = require("express");
const router = express.Router();

const {authenticateToken} = require('../middleware/authenticate')

const {checkAdmin} = require('../middleware/checkRole')

const {
    authenticateDetailsUpdate,
    authenticateRestaurantUpdate,
    authenticateDishUpdate
} = require("../middleware/authBody");

const {
    updateDetails,
    updateRole
} = require("../controllers/allUser");

const {
    updateRestaurant
} = require('../controllers/restaurant');

const {
    updateDish
} = require('../controllers/dish');

router.use(authenticateToken)
router.use(checkAdmin)
router.put('/roles/:pId/:role',updateRole);
router.put('/details',authenticateDetailsUpdate,updateDetails)
router.put('/restaurant/:rId',authenticateRestaurantUpdate,updateRestaurant)
router.put('/dish/:rId/:dId',authenticateDishUpdate,updateDish)

module.exports = router

