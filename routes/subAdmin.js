const express = require("express");
const router = express.Router();

const {authenticateToken} = require('../middleware/authenticate')

const {checkSubAdmin} = require('../middleware/checkRole')

const {checkSubAdminLogin} = require('../middleware/checkRoleLogin')

const {
    authenticateUserLogin
} = require('../middleware/authBody')

const {
    login,
    getUsers,
    getDistance,
    logout
} = require('../controllers/allUser');

const {
    getAllRestaurants,
    getRestaurants
} = require('../controllers/restaurant');

const {
    getAllDishes,
    getDishes
} = require('../controllers/dish');

router.post('/login',[authenticateUserLogin,checkSubAdminLogin],login)
router.use(authenticateToken)
router.get('/all-restaurants',getAllRestaurants)
router.get('/:rId/all-dishes',getAllDishes)
router.get('/distance/:rId/:lid',getDistance)
router.use(checkSubAdmin)
router.get('/restaurants-created',getRestaurants)
router.get('/dishes-created',getDishes)
router.get('/users-created',getUsers)
router.put('/logout',logout)

module.exports = router

