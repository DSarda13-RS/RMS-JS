const pool = require("../db");

const checkUserLogin = async(req,res,next)=>{
    const {email} = req.body;
    try{
        const isUser = await pool.query(
            'SELECT is_user FROM person WHERE email = $1 AND archived_at IS NULL',[email]);
        if(isUser.rows[0].is_user){
            next()
        } else{
            res.status(403).send('You are not a user');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const checkSubAdminLogin = async(req,res,next)=>{
    const {email} = req.body;
    try{
        const isSubAdmin = await pool.query(
            'SELECT is_sub_admin FROM person WHERE email = $1 AND archived_at IS NULL',[email]);
        if(isSubAdmin.rows[0].is_sub_admin){
            next()
        } else{
            res.status(403).send('You are not a sub admin');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const checkAdminLogin = async(req,res,next)=>{
    const {email} = req.body;
    try{
        const isAdmin = await pool.query(
            'SELECT is_admin FROM person WHERE email = $1 AND archived_at IS NULL',[email]);
        if(isAdmin.rows[0].is_admin){
            next()
        } else{
            res.status(403).send('You are not an admin');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

module.exports = {
    checkUserLogin,
    checkSubAdminLogin,
    checkAdminLogin
}

