const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/balance/:accountNumber', accountController.getBalance);
router.get('/details/:accountNumber', accountController.getAccountDetails);
router.get('/transactions/:accountNumber', accountController.getTransactionsHistory);

module.exports = router;
