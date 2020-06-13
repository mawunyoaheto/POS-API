var express = require('express');
var router = express.Router();
//const authToken = require('../middleware/auth')
const detailsController = require('../controllers/details');
const operationsController = require('../controllers/operations');
const genToken = require('../util/generateToken');


/**
* @swagger
* tags:
*   name: Operations
*   description: Operations management
*/


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

/**
 * @swagger
 * /itembaseunit:
 *  get:
 *    summary: Returns all Item Base Units
 *    tags: [ItemBaseUnit]
 *    description: Used to get all Item Base Units
 *    responses:
 *      '200':
 *        description: A succesful response
 */
router.get('/itembaseunit',operationsController.getItemBaseUnits);



/**
 * @swagger
 * path:
 *   /itembaseunit/{id}:
 *     get:
 *       summary: Returns an Item Base Unit by id
 *       tags: [ItemBaseUnit]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of item base unit to return
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: An Item Base Unit object
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     format: int64
 *                     example: 4
 *                   baseunit:
 *                     type: string
 *                     example: BOX
 *                   isactive:
 *                     type: boolean
 *                     exmample: true
 *                   createuserid:
 *                     type: integer
 *                     example: 2
 * 
 *         '400':
 *           description: The specified base unit ID is invalid (not a number).
 *         '404':
 *           description: A base unit with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */

router.get('/itembaseunit/:id',operationsController.getItemBaseUnitByID);


/**
 * @swagger
 *
 * /itembaseunit:
 *   post:
 *     summary: create item base unit
 *     tags: [ItemBaseUnit]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               baseunit:
 *                 type: string
 *               isactive:
 *                 type: string
 *     responses:
 *       200:
 *         description: created
 */

router.post('/itembaseunit',operationsController.createItemBaseUnit);

/**
 * @swagger
 * path:
 *   /itembaseunit/{id}:
 *     put:
 *       summary: updates an item base unit by id
 *       tags: [ItemBaseUnit]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of item base unit to update
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 baseunit:
 *                   type: string
 *                 isactive:
 *                   type: string
 *     responses:
 *       200:
 *         description: base unit updated
 */

router.put('/itembaseunit/:id',operationsController.updateItemBaseUnit);


module.exports=router;