const user = require('../Model/User');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const path = require("path");

function generateAccessToken(id,email){
    return jwt.sign(
        {userid: id, email: email},
        "secretKey"
    );
};

function isPremiumUser(req, res, next){
    if (req.user.isPremiumUser) {
      return res.json({ isPremiumUser: true });
    }
  };

function getLoginPage(req,res,next){
    res.sendFile(path.join(__dirname, "../","Frontend","signin", "index.html"));
};

async function postUserSignUp(req,res){

    console.log(req.body);
    try{
        const name =  req.body.name;
        const email =  req.body.email;
        const password =  req.body.password;
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

async function validateEmail(req,res){
    try{
        const email = req.params.email;
        console.log(email);
        const exists = await user.findOne({ where: { email: { [Op.like]: '%' + email + '%' } } });
        res.json({available:exists});
    }catch(err){
        console.log(err);
        res.status(500).json({err: err.message});
    }
}

async function getLogin(req,res){
   
    const email = req.body.email;
    const password = req.body.password;

    try{
        const userEmail = await(user.findOne({where:{email:email}}));
        if(userEmail){
            console.log(userEmail);
            bcrypt.compare(password, userEmail.password, (err,result)=>{
                if(result){
                    res.status(200).json({
                        success: true,
                        message: "Login Successful",
                        token: generateAccessToken(userEmail.id, userEmail.email)
                    });
                
                }else{
                    res.status(401).send('Pass Not Found');
                }
            })
        }else{
            res.status(404).send('Email Not Found');
        }
        // if(userEmail.password != password){
        //     res.send('Pass Not Found');
        // }    
            
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    generateAccessToken,
    getLogin,
    getLoginPage,
    postUserSignUp,
    validateEmail,
    isPremiumUser
}