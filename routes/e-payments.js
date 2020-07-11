var express = require('express');
var router = express.Router();
//const authToken = require('../middleware/auth')
const detailsController = require('../controllers/details');
const operationsController = require('../controllers/e-payments');
const genToken = require('../util/generateToken');

//e-payment api setup
router.get('/e-payment',operationsController.getEpaymentAPI);
router.get('/e-payment/:id',operationsController.getEpaymentAPIByID);
router.post('/e-payment',operationsController.createEpaymentAPI);
router.put('/e-payment/:id',operationsController.updateEpaymentAPI);

module.exports=router;