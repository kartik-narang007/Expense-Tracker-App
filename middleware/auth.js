const jwt = require("jsonwebtoken");
const User = require('../Model/User');

const authenticate = (req,res,next)=>{
    try{
        const token = req.header("Authorization");
        const user = jwt.verify(token, process.env.TOKEN);
        console.log(user);
        User.findByPk(user.userid).then((user)=>{
            console.log(user);
            req.user = user;
            next();
        });
    }catch(err){
        console.log(err);
        return res.status(401).json({result: false});
    }
}

module.exports = authenticate;