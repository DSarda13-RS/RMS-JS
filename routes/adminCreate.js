const express = require("express");
const router = express.Router();

//
const saltedMd5=require('salted-md5')
const path=require('path');
const multer=require('multer')
const upload=multer({storage: multer.memoryStorage()})
require('dotenv').config()
//

const {authenticateToken} = require('../middleware/authenticate')

const {checkAdmin} = require('../middleware/checkRole')

const {
    authenticateUser,
    authenticateRestaurant,
    authenticateDish
} = require('../middleware/authBody')

const {
    createUser,
    createSubAdmin,
    createAdmin
} = require('../controllers/allUser');

const {
    createRestaurant
} = require('../controllers/restaurant');

const {
    createDish
} = require('../controllers/dish');

router.use(authenticateToken)
router.use(checkAdmin)
router.post('/restaurant',authenticateRestaurant,createRestaurant)
router.post('/:rId/dish',authenticateDish,createDish)
router.post('/user',authenticateUser,createUser)
router.post('/sub-admin',authenticateUser,createSubAdmin)
router.post('/admin',authenticateUser,createAdmin)

module.exports = router

