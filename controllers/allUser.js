const pool = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const registerUser = async(req,res)=>{
    const {name,email,password,latitude,longitude} = req.body;
    const emails = await pool.query(
        'SELECT email FROM person WHERE email = $1 AND archived_at is null',[email]);
    if(emails.rowCount === 0){
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password,salt)
        const client = await pool.connect()
        try{
            await client.query('BEGIN');
            const insertUser = 'INSERT INTO person (name,email,password,is_user) VALUES ($1,$2,$3,$4) RETURNING pid';
            const insertUserValues = [name,email,hashedPassword,true];
            const pId = await client.query(insertUser,insertUserValues);
            const insertLocation = 'INSERT INTO locations (pid,p_latitude,p_longitude) VALUES ($1,$2,$3)';
            const insertLocationValues = [pId.rows[0].pid,latitude,longitude];
            await client.query(insertLocation,insertLocationValues);
            await client.query('COMMIT');
            res.status(200).json('User registered');
        } catch(err){
            await client.query('ROLLBACK');
            res.sendStatus(500);
            console.error(err.message);
        } finally{
            client.release();
        }
    } else{
        res.status(409).send('email already used');
    }
}

const login = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const details = await pool.query('SELECT pid,password FROM person WHERE email = $1 AND archived_at is null',[email]);
        if(details.rowCount === 0){
            res.status(400).send('User not found');
        } else{
            if(await bcrypt.compare(password, details.rows[0].password)){
                const sessionId = await pool.query('INSERT INTO sessions (pid) VALUES ($1) RETURNING sid',[details.rows[0].pid]);
                const user = { pId: details, sessionId: sessionId.rows[0].sid };
                const accessToken = jwt.sign(user, process.env.SIGN_IN_KEY,{ expiresIn: '30m'});
                res.status(200).json({accessToken: accessToken})
            } else{
                res.status(401).send('Incorrect Password');
            }
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const createUser = async(req,res)=>{
    const creatorId = req.uid;
    const {name,email,password,latitude,longitude} = req.body;
    const emailExist = await pool.query(
        'SELECT email FROM person WHERE email = $1 AND archived_at is null',[email]);
    if(emailExist.rowCount === 0){
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password,salt)
        const client = await pool.connect()
        try{
            await client.query('BEGIN');
            const insertUser = 'INSERT INTO person (name,email,password,is_user,created_by) VALUES ($1,$2,$3,$4,$5) RETURNING pid';
            const insertUserValues = [name,email,hashedPassword,true,creatorId];
            const pId = await client.query(insertUser,insertUserValues);
            const insertUserLocation = 'INSERT INTO locations (pid,p_latitude,p_longitude) VALUES ($1,$2,$3)';
            const insertUserLocationValues = [pId.rows[0].pid,latitude,longitude];
            await client.query(insertUserLocation,insertUserLocationValues);
            await client.query('COMMIT');
            res.status(200).json('User created');
        } catch(err){
            await client.query('ROLLBACK');
            res.sendStatus(500);
            console.error(err.message);
        } finally{
            client.release();
        }
    } else{
        res.status(409).send('email already used');
    }
}

const createSubAdmin = async(req,res)=>{
    const creatorId = req.uid;
    const {name,email,password,latitude,longitude} = req.body;
    const emailExist = await pool.query(
        'SELECT email FROM person WHERE email = $1 AND archived_at is null',[email]);
    if(emailExist.rowCount === 0){
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password,salt)
        const client = await pool.connect()
        try{
            await client.query('BEGIN');
            const insertSubAdmin = 'INSERT INTO person (name,email,password,is_sub_admin,created_by) VALUES ($1,$2,$3,$4,$5) RETURNING pid';
            const insertSubAdminValues = [name,email,hashedPassword,true,creatorId];
            const pId = await client.query(insertSubAdmin,insertSubAdminValues);
            const insertLocation = 'INSERT INTO locations (pid,p_latitude,p_longitude) VALUES ($1,$2,$3)';
            const insertLocationValues = [pId.rows[0].pid,latitude,longitude];
            await client.query(insertLocation,insertLocationValues);
            await client.query('COMMIT');
            res.status(200).json('Sub Admin created');
        } catch(err){
            await client.query('ROLLBACK');
            res.sendStatus(500);
            console.error(err.message);
        } finally{
            client.release();
        }
    } else{
        res.status(409).send('email already used');
    }
}

const createAdmin = async(req,res)=>{
    const creatorId = req.uid;
    const {name,email,password,latitude,longitude} = req.body;
    const emailExist = await pool.query(
        'SELECT email FROM person WHERE email = $1 AND archived_at is null',[email]);
    if(emailExist.rowCount === 0){
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password,salt)
        const client = await pool.connect()
        try{
            await client.query('BEGIN');
            const insertAdmin = 'INSERT INTO person (name,email,password,is_admin,created_by) VALUES ($1,$2,$3,$4,$5) RETURNING pid';
            const insertAdminValues = [name,email,hashedPassword,true,creatorId];
            const pId = await client.query(insertAdmin,insertAdminValues);
            const insertLocation = 'INSERT INTO locations (pid,p_latitude,p_longitude) VALUES ($1,$2,$3)';
            const insertLocationValues = [pId.rows[0].pid,latitude,longitude];
            await client.query(insertLocation,insertLocationValues);
            await client.query('COMMIT');
            res.status(200).json('Admin created');
        } catch(err){
            await client.query('ROLLBACK');
            res.sendStatus(500);
            console.error(err.message);
        } finally{
            client.release();
        }
    } else{
        res.status(409).send('email already used');
    }
}

const getAllUsers = async(req,res)=>{
    const page = req.query.page;
    const limit = req.query.limit;
    const offset = (page - 1)*limit;
    if(page <= 0){
        res.sendStatus(400);
    } else{
        try{
            const users = await pool.query('SELECT pid,name,email FROM person WHERE is_user = $1 AND archived_at is null LIMIT $2 OFFSET $3',
                [true,limit,offset]);
            const userId = [];
            users.rows.forEach(user=>{
                userId[userId.length] = user.pid
            });
            const allAddresses = await pool.query('SELECT pid,p_latitude,p_longitude FROM locations WHERE pid = ANY($1) AND archived_at is null',[userId]);
            const addressMap = new Map();
            allAddresses.rows.forEach(address=>{
                if(!addressMap.has(address.pid)){
                    addressMap.set(address.pid,[{lat: address.p_latitude, lon: address.p_longitude}])
                } else{
                    addressMap.get(address.pid).push({lat: address.p_latitude, lon: address.p_longitude})
                }
            });
            users.rows.forEach(user=>{
                if(!addressMap.has(user.pid)){
                    user.location = [];
                } else{
                    user.location = addressMap.get(user.pid);
                }
            });
            console.log((allAddresses.rows));
            res.status(200).json(users.rows);
        } catch(err){
            res.sendStatus(500);
            console.error(err.message);
        }
    }
}

const getUsers = async(req,res)=>{
    const creatorId = req.uid;
    const page = req.query.page;
    const limit = req.query.limit;
    const offset = (page - 1)*limit;
    if(page <= 0){
        res.sendStatus(400);
    } else{
        try{
            const usersCreated = await pool.query('SELECT pid,name,email FROM person WHERE created_by = $1 AND is_user = $2 AND archived_at is null LIMIT $3 OFFSET $4',
                [creatorId,true,limit,offset]);
            const userId = [];
            usersCreated.rows.forEach(user=>{
                userId[userId.length] = user.pid
            });
            const addresses = await pool.query('SELECT pid,p_latitude,p_longitude FROM locations WHERE pid = ANY($1) AND archived_at is null',[userId]);
            const addressMap = new Map();
            addresses.rows.forEach(address=>{
                if(!addressMap.has(address.pid)){
                    addressMap.set(address.pid,[{lat: address.p_latitude, lon: address.p_longitude}])
                } else{
                    addressMap.get(address.pid).push({lat: address.p_latitude, lon: address.p_longitude})
                }
            });
            usersCreated.rows.forEach(user=>{
                if(!addressMap.has(user.pid)){
                    user.location = [];
                } else{
                    user.location = addressMap.get(user.pid);
                }
            });
            console.log((addresses.rows));
            res.status(200).json(usersCreated.rows);
        } catch(err){
            res.sendStatus(500);
            console.error(err.message);
        }
    }
}

const getSubAdmins = async(req,res)=>{
    const creatorId = req.uid;
    try{
        const subAdmins = await pool.query('SELECT name,email FROM person WHERE created_by = $1 AND is_sub_admin = $2 AND archived_at is null',[creatorId,true]);
        res.status(200).json(subAdmins.rows);
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const getDistance = async(req,res)=>{
    const {rId,lid} = req.params;
    try{
        const restaurantLocation = await pool.query('SELECT r_latitude,r_longitude FROM restaurants WHERE rid = $1 AND archived_at is null',[rId]);
        if(restaurantLocation.rowCount === 0){
            res.sendStatus(400);
        } else{
            const userLocation = await pool.query('SELECT p_latitude,p_longitude FROM locations WHERE lid = $1 AND archived_at is null',[lid]);
            if(userLocation.rowCount === 0){
                res.sendStatus(400);
            } else{
                const lat1 = restaurantLocation.rows[0].r_latitude;
                const lon1 = restaurantLocation.rows[0].r_longitude;

                const lat2 = userLocation.rows[0].p_latitude;
                const lon2 = userLocation.rows[0].p_longitude;

                const R = 6371e3;
                const q1 = lat1 * Math.PI/180;
                const q2 = lat2 * Math.PI/180;
                const dq = (lat2-lat1) * Math.PI/180;
                const dh = (lon2-lon1) * Math.PI/180;

                const a = Math.sin(dq/2) * Math.sin(dq/2) + Math.cos(q1) * Math.cos(q2) * Math.sin(dh/2) * Math.sin(dh/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                const d = R * c / 1000;
                res.status(200).send(d);
            }
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const addLocation = async(req,res)=>{
    const userId = req.uid;
    const {latitude,longitude} = req.body;
    try{
        await pool.query('INSERT INTO locations (pid,p_latitude,p_longitude) VALUES ($1,$2,$3)',[userId,latitude,longitude]);
        res.status(200).send('Location added');
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const updateDetails = async(req,res)=>{
    try{
        const userId = req.uid;
        let {name,email,newPassword,password} = req.body;
        const details = await pool.query(
            'SELECT name,email,password FROM person WHERE pid = $1 AND archived_at is null',[userId]);
        const registeredPassword = details.rows[0].password;
        const registeredName = details.rows[0].name;
        const registeredEmail = details.rows[0].email;
        if(await bcrypt.compare(password, registeredPassword)){
            if(name === undefined){
                name = registeredName;
            }
            if(email === undefined){
                email = registeredEmail;
            }
            if(newPassword === undefined){
                newPassword = registeredPassword;
            } else{
                const salt = await bcrypt.genSalt()
                const hashedPassword = await bcrypt.hash(newPassword,salt)
                newPassword = hashedPassword;
            }
            await pool.query(
                'UPDATE person SET name = $1 , email = $2 , password = $3 , updated_at = NOW() WHERE pid = $4 AND archived_at is null', [name,email,newPassword,userId]);
            res.status(200).json('Updated');
        } else{
            res.status(401).send('Incorrect Password');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const deleteUser = async(req,res)=>{
    const pId = req.uid;
    const client = await pool.connect()
    try{
        await client.query('BEGIN');
        const deletePerson = 'UPDATE person SET archived_at = NOW() WHERE pid = $1 AND archived_at is null';
        const deletePersonValue = [pId];
        await client.query(deletePerson,deletePersonValue);
        const deleteLocations = 'UPDATE locations SET archived_at = NOW() WHERE pid = $1 AND archived_at is null';
        const deleteLocationValue = [pId];
        await client.query(deleteLocations,deleteLocationValue);
        const deleteSessions = 'UPDATE sessions SET is_ended = true WHERE pid = $1 AND is_ended = false';
        const deleteSessionsValue = [pId];
        await client.query(deleteSessions,deleteSessionsValue);
        await client.query('COMMIT');
        res.status(200).send('Successfully deleted');
    } catch(err){
        await client.query('ROLLBACK');
        res.sendStatus(500);
        console.error(err.message);
    } finally{
        client.release();
    }
}

const logout = async(req,res)=>{
    try{
        const sessionId = req.sessionId;
        await pool.query('UPDATE sessions SET is_ended = true, end_time = NOW() WHERE sid = $1',[sessionId]);
        res.status(200).json('Logged Out');
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const updateRole = async(req,res)=>{
    const uId = req.uid;
    const {pId,role} = req.params;
    if(uId === pId){
        res.status(403).send('Admin cannot update itself');
    } else{
        try{
            if(role === "admin"){
                await pool.query('UPDATE person SET is_admin = true, is_sub_admin = false, updated_at = NOW() WHERE pid = $1 AND archived_at is null',[pId]);
            }
            else if(role === "sub-admin"){
                await pool.query('UPDATE person SET is_sub_admin = true, is_admin = false, updated_at = NOW() WHERE pid = $1 AND archived_at is null',[pId]);
            }
            else if(role === "user"){
                await pool.query('UPDATE person SET is_user = true, is_sub_admin = false, is_admin = false, updated_at = NOW() WHERE pid = $1 AND archived_at is null',[pId]);
            }
            res.status(200).send('Role Updated');
        } catch(err){
            res.sendStatus(500);
            console.error(err.message);
        }
    }
}

module.exports = {
    registerUser,
    login,
    createUser,
    createSubAdmin,
    createAdmin,
    getAllUsers,
    getUsers,
    getSubAdmins,
    getDistance,
    addLocation,
    updateDetails,
    updateRole,
    deleteUser,
    logout
}

