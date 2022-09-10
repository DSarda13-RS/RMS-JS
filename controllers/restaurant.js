const pool = require("../db");
const admin = require("firebase-admin");
const serviceAccount = require("../utils/serviceAccountKey.json");
require('dotenv').config()

//
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.BUCKET_URL
});
app.locals.bucket = admin.storage().bucket();
//

const createRestaurant = async(req,res)=>{
    const creatorId = req.uid;
    const {name,latitude,longitude} = req.body;
    const restaurantId = await pool.query(
        'SELECT rid FROM restaurants WHERE name = $1 AND r_latitude = $2 AND r_longitude = $3 AND archived_at is null',[name,latitude,longitude]);
    if(restaurantId.rowCount === 0){
        try{
            await pool.query('INSERT INTO restaurants (name,r_latitude,r_longitude,created_by) VALUES ($1,$2,$3,$4)',[name,latitude,longitude,creatorId]);
            res.status(200).json('Restaurant created');
        } catch(err){
            res.sendStatus(500);
            console.error(err.message);
        }
    } else{
        res.status(409).send('Restaurant already exists');
    }
}

const getAllRestaurants = async(req,res)=>{
    try{
        const allRestaurants = await pool.query('SELECT name FROM restaurants WHERE archived_at is null');
        res.status(200).json(allRestaurants.rows);
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const getRestaurants = async(req,res)=>{
    const creatorId = req.uid;
    try{
        const restaurants = await pool.query('SELECT name FROM restaurants WHERE created_by = $1 archived_at is null',[creatorId]);
        res.status(200).json(restaurants.rows);
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const updateRestaurant = async(req,res)=>{
    try{
        const {rId} = req.params;
        let {name,latitude,longitude} = req.body;
        const details = await pool.query(
            'SELECT name,r_latitude,r_longitude FROM restaurants WHERE rid = $1 AND archived_at is null',[rId]);
        const registeredName = details.rows[0].name;
        const registeredLatitude = details.rows[0].r_latitude;
        const registeredLongitude = details.rows[0].r_longitude;
        if(name === undefined){
            name = registeredName;
        }
        if(latitude === undefined){
            latitude = registeredLatitude;
        }
        if(longitude === undefined){
            longitude = registeredLongitude;
        }
        await pool.query(
            'UPDATE restaurants SET name = $1 , r_latitude = $2 , r_longitude = $3 , updated_at = NOW() WHERE rid = $4 AND archived_at is null',
            [name,latitude,longitude,rId]);
        res.status(200).send('Updated Restaurant');
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const removeRestaurant = async(req,res)=>{
    const {rId} = req.params;
    const client = await pool.connect()
    try{
        await client.query('BEGIN');
        const deleteRestaurant = 'UPDATE restaurants SET archived_at = NOW() WHERE rid = $1 AND archived_at is null';
        const deleteRestaurantValue = [rId];
        await client.query(deleteRestaurant,deleteRestaurantValue);
        const deleteDishes = 'UPDATE dishes SET archived_at = NOW() WHERE rid = $1 AND archived_at is null';
        const deleteDishesValue = [rId];
        await client.query(deleteDishes,deleteDishesValue);
        await client.query('COMMIT');
        res.status(200).send('Successfully removed Restaurant');
    } catch(err){
        await client.query('ROLLBACK');
        res.sendStatus(500);
        console.error(err.message);
    } finally{
        client.release();
    }
}

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurants,
    updateRestaurant,
    removeRestaurant
}

