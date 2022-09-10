const pool = require("../db");

const checkUser = async(req,res,next)=>{
    const userId = req.uid;
    const isUser = await pool.query(
        'SELECT is_user FROM person WHERE pid = $1 AND archived_at IS NULL',[userId]);
    if(isUser.rows[0].is_user){
        next()
    } else{
        res.status(403).send('You are not a user');
    }
}

const checkSubAdmin = async(req,res,next)=>{
    const userId = req.uid;
    const isSubAdmin = await pool.query(
        'SELECT is_sub_admin FROM person WHERE pid = $1 AND archived_at IS NULL',[userId]);
    if(isSubAdmin.rows[0].is_sub_admin){
        next()
    } else{
        res.status(403).send('You are not a sub admin');
    }
}

const checkAdmin = async(req,res,next)=>{
    const userId = req.uid;
    const isAdmin = await pool.query(
        'SELECT is_admin FROM person WHERE pid = $1 AND archived_at IS NULL',[userId]);
    if(isAdmin.rows[0].is_admin){
        next()
    } else{
        res.status(403).send('You are not an admin');
    }
}

module.exports = {
    checkUser,
    checkSubAdmin,
    checkAdmin
}

