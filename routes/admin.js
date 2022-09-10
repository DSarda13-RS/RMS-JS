const express = require("express");
const router = express.Router();

const {authenticateToken} = require('../middleware/authenticate')

const {checkAdmin} = require('../middleware/checkRole')

const {checkAdminLogin} = require('../middleware/checkRoleLogin')

const {
    authenticateUserLogin
} = require('../middleware/authBody')

const {
    login,
    getUsers,
    getAllUsers,
    getSubAdmins,
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

router.post('/login',[authenticateUserLogin,checkAdminLogin],login)
router.use(authenticateToken)
router.get('/all-restaurants',getAllRestaurants)
router.get('/:rId/all-dishes',getAllDishes)
router.get('/distance/:rId/:lid',getDistance)
router.use(checkAdmin)
router.get('/restaurants-created',getRestaurants)
router.get('/dishes-created',getDishes)
router.get('/users-created',getUsers)
router.get('/all-users',getAllUsers)
router.get('/sub-admin-created',getSubAdmins)
router.put('/logout',logout)

module.exports = router

