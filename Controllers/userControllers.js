const User = require('../Model/User');
const user = require('../Model/User');
const { Op } = require('sequelize');



exports.postUserSignUp = async(req,res)=>{

    console.log(req.body);
    try{
    const name =  req.body.name;
    const email =  req.body.email;
    const password =  req.body.password;
    console.log(name,email,password);
    const newUser = await user.create({name, email, password});
    res.json(newUser);
    }catch(err){
        console.log(err);
        res.status(500).json({ error : err.message });
    }
}

exports.validateEmail = async (req,res)=>{
    try{
        const email = req.params.email;
        console.log(email);
        const exists = await User.findOne({ where: { email: { [Op.like]: '%' + email + '%' } } });
        console.log(exists);
        res.json({available:exists});
    }catch(err){
        console.log(err);
        res.status(500).json({err: err.message});
    }
}