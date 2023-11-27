const express = require('express');
const router = express.Router();

const purchaseControllers = require('../Controllers/purchaseControllers');

const authenticationMiddleware = require('../middleware/auth');


router.get('/premiummembership', authenticationMiddleware, purchaseControllers.purchasePremium);
router.post('/updatetransactionstatus', authenticationMiddleware, purchaseControllers.updateTransactionStatus);

module.exports = router;