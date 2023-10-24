const express = require('express');

const router = express.Router();

const userControllers = require('../Controllers/userControllers');

router.post('/user-signup', userControllers.postUserSignUp);
router.get('/validate-email/:email', userControllers.validateEmail);

module.exports = router;