var express = require('express');
var router = express.Router();
//const authToken = require('../middleware/auth')
const detailsController = require('../controllers/details');
const operationsController = require('../controllers/operations');
const genToken = require('../util/generateToken');


router.get('/',detailsController.home_page);

//payment modes routes

router.get('/payment-mode',operationsController.getPaymentModes);
router.get('/payment-mode/:id',operationsController.getPaymentModeByID);
router.post('/payment-mode',operationsController.createPaymentMode);
router.put('/payment-mode/:id',operationsController.updatePaymentMode);

//Outlet routes
router.get('/outlet',operationsController.getOutlets);
router.get('/outlet/:id',operationsController.getOutletsByID);
router.post('/outlet',operationsController.createOutlet);
router.put('/outlet/:id',operationsController.updateOutlet);

//Tax routes
router.get('/tax',operationsController.getTax);
router.get('/tax/:id',operationsController.getTaxByID);
router.post('/tax',operationsController.createTax);
router.put('/tax/:id',operationsController.updateTax);

//Supplier routes
router.get('/supplier',operationsController.getSuppliers);
router.get('/supplier/:id',operationsController.getSupplierByID);
router.post('/supplier',operationsController.createSupplier);
router.put('/supplier/:id',operationsController.updateSupplier);


//e-payment api setup
router.get('/e-payment',operationsController.getEpaymentAPI);
router.get('/e-payment/:id',operationsController.getEpaymentAPIByID);
router.post('/e-payment',operationsController.createEpaymentAPI);
router.put('/e-payment/:id',operationsController.updateEpaymentAPI);

//Item Base Unit  routes
router.get('/itembaseunit',operationsController.getItemBaseUnits);
router.get('/itembaseunit/:id',operationsController.getItemBaseUnitByID);
router.post('/itembaseunit',operationsController.createItemBaseUnit);
router.put('/itembaseunit/:id',operationsController.updateItemBaseUnit);


module.exports=router;