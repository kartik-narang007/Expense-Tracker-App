const path = require("path");
const User = require("../Model/User");
const ResetPassword = require("../Model/resetPasswordModel");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const { resetPasswordPage } = require("./userControllers");
const saltRounds = 10;

const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

exports.forgotPasswordPage = async (req, res, next) => {
    try {
        res.status(200).sendFile(path.join(__dirname, "../", "Frontend", "Forgot-Password", "index.html"));
    } catch (err) {
        console.log(err);
    }
}

exports.sendMail = async (req, res, next) => {
    try {
        const email = req.body.email;
        const requestId = uuidv4();

        const recepeintEmail = await User.findOne({ where: { email: email } });
        if (!recepeintEmail) {
            return res.status(404).json({
                message: "Please provide the registerd email!"
            })
        };

        const resetRequest = await ResetPassword.create({
            id: requestId,
            isActive: true,
            userId: recepeintEmail.dataValues.id,
        });

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.RESET_PASSWORD_API_KEY;
        const transEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: "narangk007@gmail.com",
            name: "Kartik Narang"
        }
        const receivers = [
            {
                email: email,
            }
        ]
        const emailResponse = await transEmailApi.sendTransacEmail({
            sender,
            To: receivers,
            subject: "Expense Tracker Reset Password",
            textContent: "Link Below",
            htmlContent: `<h3>Hi! We got the request from you for reset the password. Here is the link below >>></h3>
      <a href="http://localhost:3000/resetPasswordPage/{{params.requestId}}"> Click Here</a>`,
            params: {
                requestId: requestId,
            },
        });
        return res.status(200).json({
            message:
                "Link for reset the password is successfully send on your Mail Id!",
        });
    } catch (error) {
        console.log(error);
        return res.status(409).json({ message: "failed changing password" });
    }
}

exports.resetPasswordPage = async (req, res, next) => {
  try {
    res
      .status(200)
      .sendFile(
        path.join(__dirname, "../", "Frontend", "Reset-Password", "index.html")
      );
  } catch (error) {
    console.log(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const requestId = req.headers.referer.split("/");
    const password = req.body.password;
    const checkResetRequest = await ResetPassword.findAll({
      where: { id: requestId[requestId.length - 1], isActive: true },
    });
    if (checkResetRequest[0]) {
      const userId = checkResetRequest[0].dataValues.userId;
      const result = await ResetPassword.update(
        { isActive: false },
        { where: { id: requestId } }
      );
      const newPassword = await hashPassword(password);
      const user = await User.update(
        { password: newPassword },
        { where: { id: userId } }
      );
      return res
        .status(200)
        .json({ message: "Successfully changed password!" });
    } else {
      return res
        .status(409)
        .json({ message: "Link is already Used Once, Request for new Link!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(409).json({ message: "Failed to change password!" });
  }
};