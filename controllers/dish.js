const pool = require("../db");
require('dotenv').config()

const createDish = async(req,res)=>{
    const creatorId = req.uid;
    const {name,price} = req.body;
    const {rId} = req.params;
    const restaurant = await pool.query(
        'SELECT archived_at FROM restaurants WHERE rid = $1',[rId]);
    if(restaurant.rows[0].archived_at === null){
        try{
            await pool.query('INSERT INTO dishes (name,price,rid,created_by) VALUES ($1,$2,$3,$4)',[name,price,rId,creatorId]);
            res.status(200).json('Dish created');
        } catch(err){
            res.sendStatus(500);
            console.error(err.message);
        }
    } else{
        res.status(409).send('Restaurant does not exists');
    }
}

const getAllDishes = async(req,res)=>{
    const {rId} = req.params;
    try{
        const allDishes = await pool.query('SELECT name,price FROM dishes WHERE rid = $1 AND archived_at is null',[rId]);
        res.status(200).json(allDishes.rows);
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const getDishes = async(req,res)=>{
    const creatorId = req.uid;
    try{
        const dishes = await pool.query('SELECT name,price FROM dishes WHERE created_by = $1 AND archived_at is null',[creatorId]);
        res.status(200).json(dishes.rows);
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const updateDish = async(req,res)=>{
    try{
        const {rId,dId} = req.params;
        let {name,price} = req.body;
        const details = await pool.query(
            'SELECT name,price FROM dishes WHERE rid = $1 AND did = $2 AND archived_at is null',[rId,dId]);
        const registeredName = details.rows[0].name;
        const registeredPrice = details.rows[0].price;
        if(name === undefined){
            name = registeredName;
        }
        if(price === undefined){
            price = registeredPrice;
        }
        await pool.query(
            'UPDATE dishes SET name = $1 , price = $2 , updated_at = NOW() WHERE rid = $3 AND did = $4 AND archived_at is null',
            [name,price,rId,dId]);
        res.status(200).send('Updated Dish');
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const removeDish = async(req,res)=>{
    const {rId,dId} = req.params;
    try{
        await pool.query('UPDATE dishes SET archived_at = NOW() WHERE rid = $1 AND did = $2 AND archived_at is null',[rId,dId]);
        res.status(200).send('Successfully removed Dish');
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

module.exports = {
    createDish,
    getAllDishes,
    getDishes,
    updateDish,
    removeDish
}
