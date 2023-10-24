const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./Routes/userRoutes');
const sequelize = require('./Utils/Database');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(userRoutes);
sequelize.sync().then(()=>{
    app.listen(3000, ()=>{
        console.log('server is running on localhost : 3000');
    })
}).catch((err)=>{
    console.log(err);
})





