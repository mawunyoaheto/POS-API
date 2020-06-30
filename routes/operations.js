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

/**
 * @swagger
 * /payment-mode:
 *  get:
 *    summary: Returns all Payment modes
 *    tags: [Payment Modes]
 *    description: Get all Payment Modes
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/payment-mode',operationsController.getPaymentModes);


/**
 * @swagger
 * path:
 *   /payment-mode/{id}:
 *     get:
 *       summary: Returns a Payment Mode by id
 *       tags: [Payment Modes]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of PaymentMode to return
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *         '400':
 *           description: The specified PaymentMode ID is invalid (not a number).
 *         '404':
 *           description: A PaymentMode with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/payment-mode/:id',operationsController.getPaymentModeByID);

/**
 * @swagger
 *
 * /payment-mode:
 *   post:
 *     summary: Add New Payment Mode
 *     tags: [Payment Modes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               isactive:
 *                 type: boolean
 *               userid:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: created
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
router.post('/payment-mode',operationsController.createPaymentMode);

/**
 * @swagger
 *
 * /payment-mode/{id}:
 *   put:
 *     summary: Update Payment Mode
 *     tags: [Payment Modes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of outlet to update
 *         shema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               isactive:
 *                 type: boolean
 *               userid:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: created
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
router.put('/payment-mode/:id',operationsController.updatePaymentMode);

//Outlet routes

router.get('/outlet',operationsController.getOutlets);

/**
 * @swagger
 * path:
 *   /outlet/{id}:
 *     get:
 *       summary: Returns an Outlet by id
 *       tags: [Outlets]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of Outlet to return
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *         '400':
 *           description: The specified Outlet ID is invalid (not a number).
 *         '404':
 *           description: An Outlet with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/outlet/:id',operationsController.getOutletsByID);


/**
 * @swagger
 *
 * /outlet:
 *   post:
 *     summary: Add an Outlet (Branch)
 *     tags: [Outlets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               outletname:
 *                 type: string
 *               countryID:
 *                 type: integer
 *               regionID:
 *                 type: integer
 *               cityID:
 *                 type: integer
 *               email:
 *                 type: string
 *               contactnumber:
 *                 type: string
 *               taxID:
 *                 type: integer
 *               userid:
 *                 type: integer
 *               isactive:
 *                 type: boolean
 *     responses:
 *       '201':
 *         description: created
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
router.post('/outlet',operationsController.createOutlet);

/**
 * @swagger
 *
 * /outlet/{id}:
 *   put:
 *     summary: Update an Outlet (Branch)
 *     tags: [Outlets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of outlet to update
 *         shema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               outletname:
 *                 type: string
 *               countryID:
 *                 type: integer
 *               regionID:
 *                 type: integer
 *               cityID:
 *                 type: integer
 *               email:
 *                 type: string
 *               contactnumber:
 *                 type: string
 *               taxID:
 *                 type: integer
 *               userid:
 *                 type: integer
 *               isactive:
 *                 type: boolean
 *     responses:
 *       '201':
 *         description: created
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
router.put('/outlet/:id',operationsController.updateOutlet);

//Tax routes


/**
 * @swagger
 * /tax:
 *  get:
 *    summary: Returns all Tax
 *    tags: [Tax]
 *    description: Get all Tax
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No Record found
 *      '400':
 *        description: Unexpected error
 */
router.get('/tax',operationsController.getTax);

/**
 * @swagger
 * path:
 *   /tax/{id}:
 *     get:
 *       summary: Returns Tax by id
 *       tags: [Tax]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of Tax to return
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *         '400':
 *           description: The specified Tax ID is invalid (not a number).
 *         '404':
 *           description: A Tax with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/tax/:id',operationsController.getTaxByID);

/**
 * @swagger
 *
 * /tax:
 *   post:
 *     summary: Add New Tax
 *     tags: [Tax]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taxdescription:
 *                 type: string
 *               percentage:
 *                 type: float
 *               userid:
 *                 type: integer
 *               isactive:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: created
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
router.post('/tax',operationsController.createTax);

/**
 * @swagger
 * path:
 *   /tax/{id}:
 *     put:
 *       summary: Updates Tax by id
 *       tags: [Tax]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of Tax to update
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taxdescription:
 *                 type: string
 *               percentage:
 *                 type: float
 *               userid:
 *                 type: integer
 *               isactive:
 *                 type: boolean
 *       responses:
 *         '200':
 *           description: updated
 *         '402':
 *           description: failed
 *         '400':
 *           description: Unexpected error
 */
router.put('/tax/:id',operationsController.updateTax);

//Supplier routes

/**
 * @swagger
 * /supplier:
 *  get:
 *    summary: Returns all suppliers
 *    tags: [Suppliers]
 *    description: Get all Suppliers
 *    responses:
 *      '200':
 *        description: OK
 */
router.get('/supplier',operationsController.getSuppliers);

/**
 * @swagger
 * path:
 *   /supplier/{id}:
 *     get:
 *       summary: Returns a Supplier by id
 *       tags: [Suppliers]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of item base unit to return
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *         '400':
 *           description: The specified Supplier ID is invalid (not a number).
 *         '404':
 *           description: A Supplier with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/supplier/:id',operationsController.getSupplierByID);

/**
 * @swagger
 *
 * /supplier:
 *   post:
 *     summary: Add a Supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               suppliername:
 *                 type: string
 *               address:
 *                 type: string
 *               phonenumber:
 *                 type: string
 *               email:
 *                 type: string
 *               isactive:
 *                 type: string
 *               userid:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: created
 *       '400':
 *         description: Unexpected error
 */
router.post('/supplier',operationsController.createSupplier);

/**
 * @swagger
 * path:
 *   /supplier/{id}:
 *     put:
 *       summary: Updates a Supplier by id
 *       tags: [Suppliers]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of Supplier to update
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suppliername:
 *                   type: string
 *                 address:
 *                   type: string
 *                 phonenumber:
 *                   type: string
 *                 email:
 *                   type: string
 *                 isactive:
 *                   type: string
 *                 userid:
 *                   type: integer
 *       responses:
 *         '200':
 *           description: updated
 */
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
 *    description: Get all Item Base Units
 *    responses:
 *      '200':
 *        description: OK
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
 *     summary: Create Item Base Unit
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
 *       '200':
 *         description: created
 */

router.post('/itembaseunit',operationsController.createItemBaseUnit);

/**
 * @swagger
 * path:
 *   /itembaseunit/{id}:
 *     put:
 *       summary: Updates an Item Base Unit by id
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
 *       responses:
 *         '200':
 *           description: updated
 */

router.put('/itembaseunit/:id',operationsController.updateItemBaseUnit);

//MODULES ROUTES

/**
 * @swagger
 * /modules:
 *  get:
 *    summary: Returns all Modules
 *    tags: [Modules]
 *    description: Get all Modules
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/modules',operationsController.getModules);


/**
 * @swagger
 * path:
 *   /modules/{id}:
 *     get:
 *       summary: Returns a Module by id
 *       tags: [Modules]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of Module to return
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *         '400':
 *           description: The specified Module ID is invalid (not a number).
 *         '404':
 *           description: A Module with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/modules/:id',operationsController.getModuleByID);

/**
 * @swagger
 * path:
 *   /moduletrans/{id}:
 *     get:
 *       summary: Returns a Module Transactions by Module id
 *       tags: [Module Transactions]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of Module to return
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *         '400':
 *           description: The specified Module ID is invalid (not a number).
 *         '404':
 *           description: A Module with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/moduletrans/:id',operationsController.getModuleTransactionsByModuleID); 

/**
 * @swagger
 * path:
 *   /transtages/{id}:
 *     get:
 *       summary: Returns Transaction Stages Module Transaction id
 *       tags: [Transaction Stages]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: module Transaction id for returning Transaction Stages 
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *         '400':
 *           description: The specified Module Transaction ID is invalid (not a number).
 *         '404':
 *           description: A Transaction Stage for the specified Module Transaction ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/transtages/:id',operationsController.getTransactionStagesByModuleTransID);





module.exports=router;