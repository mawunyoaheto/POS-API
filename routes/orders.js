var express = require('express');
var router = express.Router();
//const authToken = require('../middleware/auth')
const detailsController = require('../controllers/details');
const ordersController = require('../controllers/orders');
const genToken = require('../util/generateToken');


router.get('/',detailsController.home_page);

//order status routes

router.get('/orderstatus',ordersController.getOrderStatus);
router.get('/orderstatus/:id',ordersController.getOrderStatusByID);
// router.post('/payment-mode',operationsController.createPaymentMode);
// router.put('/payment-mode/:id',operationsController.updatePaymentMode);

//orders routes
router.post('/orders',ordersController.createOrder);
router.post('/orderreceival',ordersController.createOrderReceival);


module.exports=router;