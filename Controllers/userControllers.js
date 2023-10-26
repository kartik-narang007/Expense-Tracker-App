const User = require('../Model/User');
const user = require('../Model/User');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');


exports.postUserSignUp = async(req,res)=>{

    console.log(req.body);
    try{
        const name =  req.body.name;
        const email =  req.body.email;
        const password =  req.body.password;
        console.log(name,email,password);
        bcrypt.hash(password, 10, async (err,hash)=>{
            console.log(err);
            await user.create({name, email, password : hash});
            res.status(201).json({message: 'Successfully created new user'});
    })
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

exports.getLogin = async(req,res)=>{
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    try{
        const userEmail = await(user.findOne({where:{email}}));
        if(userEmail){
            bcrypt.compare(password, userEmail.password, (err,result)=>{
                if(result){
                    console.log(result);
                    res.send('Logged In Successfully');
                }else{
                    res.send('Pass Not Found')
                }
            })
        }else{
            res.send('Email Not Found');
        }
        // if(userEmail.password != password){
        //     res.send('Pass Not Found');
        // }    
            
    }catch(err){
        console.log(err);
    }
}
