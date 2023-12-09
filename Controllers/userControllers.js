const user = require('../Model/User');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const path = require("path");
const sequelize = require('../Utils/Database');
const Sib = require("sib-api-v3-sdk");
function generateAccessToken(id,email){
    return jwt.sign(
        {userid: id, email: email},
        "secretKey"
    );
};

const isPremiumUser = async (req, res, next)=>{
    try {
        if (req.user.isPremiumUser) {
                return res.json({ isPremiumUser: true });
        }
    }catch(error){
        console.log(error);
    }
  };

const getLoginPage = (req,res,next)=>{
    try{
        res.sendFile(path.join(__dirname, "../","Frontend","signin", "index.html"));
    }catch(error){
        console.log(error);
    }
        
};

const postUserSignUp = async (req,res)=>{
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

const getAllUsers = async (req, res, next) => {
    
    try{
        user.findAll({
        attributes: [
            [sequelize.col("name"), "name"],
            [sequelize.col("totalExpenses"), "totalExpenses"],
        ],
        order: [[sequelize.col("totalExpenses"), "DESC"]],
        }).then((users) => {
        const result = users.map((user) => ({
            name: user.getDataValue("name"),
            totalExpenses: user.getDataValue("totalExpenses"),
        }));
        res.send(JSON.stringify(result));
        })
    }catch(err){
        console.log(err);
    }
  };

const resetPasswordPage = async (req,res,next) =>{
    try{
        res.status(200).sendFile(
            path.join(__dirname, "../", "Frontend", "Reset-Password", "index.html")
        )
    }catch(err){
        console.log(err);
    }
}

const sendMail = async (req,res,next)=>{
    try{
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.RESET_PASSWORD_API_KEY;
        const transEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: "narangk007@gmail.com",
            Name: "Kartik Narang",
        }
        const receivers = [
            {
                email : req.body.email,
            }
        ];
        const emailResponse =   await transEmailApi
        .sendTransacEmail({
            sender,
            To: receivers,
            subject: "Expense Tracker Reset Password",
            textContent: "Link Below",
        });
        res.send(
            `<script>alert('Check your mails, Link for reset the password is successfully send on your Mail Id!'); window.location.href='/'</script>`
        );
        res.redirect("/");
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
    isPremiumUser,
    getAllUsers,
    resetPasswordPage,
    sendMail
}