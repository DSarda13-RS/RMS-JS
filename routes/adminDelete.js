const express = require("express");
const router = express.Router();

const {authenticateToken} = require('../middleware/authenticate')

const {checkAdmin} = require('../middleware/checkRole')

const {
    deleteUser
} = require("../controllers/allUser");

const {
    removeRestaurant
} = require('../controllers/restaurant');

const {
    removeDish
} = require('../controllers/dish');

router.use(authenticateToken)
router.use(checkAdmin)
router.delete('/restaurant/:rId',removeRestaurant)
router.delete('/',deleteUser)
router.delete('/dish/:rId/:dId',removeDish)

module.exports = router

