const Razorpay = require('razorpay');
const Order = require('../Model/Orders');
const userControllers = require('../Controllers/userControllers');

exports.purchasePremium = async(req,res)=>{
    try{
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET_KEY
        })
        const amount = 2500;
        console.log("Entered in Controller");
        rzp.orders.create({amount, currency: 'INR'}, (err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderId: order.id, status: 'PENDING'}).then(()=>{
                return res.status(201).json({order, key_id: rzp.key_id});
            }).catch(err=>{
                throw new Error(err)
            })
        })
    }catch(err){
        throw new Error(err)
    }
}

exports.updateTransactionStatus = async (req,res)=>{
    try{
        console.log("Entered in Contoller 2");
        const userId = req.user.id;
        const {payment_id,order_id} = req.body;
        console.log(payment_id);
        console.log(order_id);
        const order = await Order.findOne({ where: {orderId: order_id} });
        console.log(order);
        const promise1 = order.update({
            paymentId: payment_id,
            status: "SUCCESSFUL"
        });
        const promise2 = req.user.update({ isPremiumUser:true });

        Promise.all([promise1, promise2]).then(()=>{
            return res.status(202).json({
                sucess: true,
                message: "Transaction Successful",
                token: userControllers.generateAccessToken(userId, undefined, true),
            })
        }).catch((err)=>{
            console.log(err)
        })
    }catch(err){
        console.log(err);
    }
}