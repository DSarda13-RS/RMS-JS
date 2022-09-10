const express = require("express");
const router = express.Router();

const {authenticateToken} = require('../middleware/authenticate')

const {
    authenticateUser,
    authenticateUserLogin,
    authenticateLocation,
    authenticateDetailsUpdate
} = require('../middleware/authBody')

const {checkUserLogin} = require('../middleware/checkRoleLogin')

const {checkUser} = require('../middleware/checkRole')

const {
    registerUser,
    login,
    getDistance,
    addLocation,
    updateDetails,
    deleteUser,
    logout
} = require('../controllers/allUser');

const {
    getAllRestaurants
} = require('../controllers/restaurant');

const {
    getAllDishes
} = require('../controllers/dish');

router.post('/register',authenticateUser,registerUser)
router.post('/login',[authenticateUserLogin,checkUserLogin],login)
router.use(authenticateToken)
router.get('/all-restaurants',getAllRestaurants)
router.get('/:rId/all-dishes',getAllDishes)
router.get('/distance/:rId/:lid',getDistance)
router.post('/add-location',authenticateLocation,addLocation)
router.use(checkUser)
router.put('/update',authenticateDetailsUpdate,updateDetails)
router.delete('/delete',deleteUser)
router.put('/logout',logout)

module.exports = router

