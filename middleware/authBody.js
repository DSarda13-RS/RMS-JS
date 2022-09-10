const {authUser} = require("../validations/validationUser");
const {authUserLogin} = require("../validations/validationUserLogin");
const {authRestaurant} = require("../validations/validationRestaurant");
const {authDish} = require("../validations/validationDish");
const {authLocation} = require("../validations/validationLocation");
const {authDetailsUpdate} = require("../validations/validationDetailsUpdate");
const {authRestaurantUpdate} = require("../validations/validationRestaurantUpdate");
const {authDishUpdate} = require("../validations/validationDishUpdate");

const authenticateUser = async(req,res,next)=>{
    const {name,email,password,latitude,longitude} = req.body;
    if(authUser.validate({name,email,password,latitude,longitude}).error == null){
        next()
    } else{
        res.status(400).json(authUser.validate({name,email,password,latitude,longitude}).error.message);
    }
}

const authenticateUserLogin = async(req,res,next)=>{
    const {email,password} = req.body;
    if(authUserLogin.validate({email,password}).error == null){
        next()
    } else{
        res.status(403).json(authUserLogin.validate({email,password}).error.message);
    }
}

const authenticateRestaurant = async(req,res,next)=>{
    const {name,latitude,longitude} = req.body;
    if(authRestaurant.validate({name,latitude,longitude}).error == null){
        next()
    } else{
        res.status(400).json(authRestaurant.validate({name,latitude,longitude}).error.message);
    }
}

const authenticateDish = async(req,res,next)=>{
    const {name,price} = req.body;
    if(authDish.validate({name,price}).error == null){
        next()
    } else{
        res.status(400).json(authDish.validate({name,price}).error.message);
    }
}

const authenticateLocation = async(req,res,next)=>{
    const {latitude,longitude} = req.body;
    if(authLocation.validate({latitude,longitude}).error == null){
        next()
    } else{
        res.status(400).json(authLocation.validate({latitude,longitude}).error.message);
    }
}

const authenticateDetailsUpdate = async(req,res,next)=>{
    const {name,email,newPassword,password} = req.body;
    if(authDetailsUpdate.validate({name,email,newPassword,password}).error == null){
        next()
    } else{
        res.status(403).json(authDetailsUpdate.validate({name,email,newPassword,password}).error.message);
    }
}

const authenticateRestaurantUpdate = async(req,res,next)=>{
    const {name,latitude,longitude} = req.body;
    if(authRestaurantUpdate.validate({name,latitude,longitude}).error == null){
        next()
    } else{
        res.status(403).json(authRestaurantUpdate.validate({name,latitude,longitude}).error.message);
    }
}

const authenticateDishUpdate = async(req,res,next)=>{
    const {name,price} = req.body;
    if(authDishUpdate.validate({name,price}).error == null){
        next()
    } else{
        res.status(400).json(authDishUpdate.validate({name,price}).error.message);
    }
}

module.exports = {
    authenticateUser,
    authenticateUserLogin,
    authenticateRestaurant,
    authenticateDish,
    authenticateLocation,
    authenticateDetailsUpdate,
    authenticateRestaurantUpdate,
    authenticateDishUpdate
}

