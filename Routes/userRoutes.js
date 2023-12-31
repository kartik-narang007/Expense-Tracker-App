const express = require('express');
const router = express.Router();
const userControllers = require('../Controllers/userControllers');
const userAuthentication = require('../middleware/auth');

router.use(express.static("Frontend"));

router.get("/", userControllers.getLoginPage);
router.post('/user-signup', userControllers.postUserSignUp);
router.get('/validate-email/:email', userControllers.validateEmail);
router.get('/getAllUsers', userControllers.getAllUsers);
router.post('/getLogin', userControllers.getLogin);
router.get("/isPremiumUser", userAuthentication, userControllers.isPremiumUser);
module.exports = router;