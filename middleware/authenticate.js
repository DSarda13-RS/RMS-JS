const jwt = require("jsonwebtoken");
const pool = require("../db");
const authenticateToken = async(req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token === null){
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.SIGN_IN_KEY, async (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        req.uid = user.pId.rows[0].pid;
        req.sessionId = user.sessionId;
        const isEnded = await pool.query('SELECT is_ended FROM sessions WHERE sid = $1', [req.sessionId]);
        if(isEnded.rows[0].is_ended === true){
            res.status(440).send('Session Expired!!!');
        } else{
            next()
        }
    })
}

module.exports = {
    authenticateToken
}

