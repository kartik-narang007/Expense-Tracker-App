const express = require('express');
const router = express.Router();

const resetPasswordControllers = require('../Controllers/resetPasswordControllers');

router.get('/forgotPasswordPage', resetPasswordControllers.forgotPasswordPage);
router.post('/sendMail', resetPasswordControllers.sendMail);
router.get('/resetPasswordPage/:requestId', resetPasswordControllers.resetPasswordPage);
router.post('/resetPassword',resetPasswordControllers.updatePassword);

module.exports = router;

