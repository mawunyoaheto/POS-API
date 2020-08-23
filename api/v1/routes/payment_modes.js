var express = require('express');
var router = express.Router();
//const authToken = require('../middleware/auth')
const detailsController = require('../controllers/details');
const operationsController = require('../controllers/payment_modes');
const genToken = require('../util/generateToken');



//payment modes routes

/**
 * @swagger
 * /payments/all-paymentmodes:
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
router.get('/all-paymentmodes',operationsController.getPaymentModes);


/**
 * @swagger
 * path:
 *   /payments/get-paymentmode:
 *     get:
 *       summary: Returns a Payment Mode by id
 *       tags: [Payment Modes]
 *       parameters:
 *         - in: query
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
 *         '500':
 *           description: A PaymentMode with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/get-paymentmode',operationsController.getPaymentModeByID);

/**
 * @swagger
 *
 * /payments/add-paymentmode:
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
router.post('/add-paymentmode',operationsController.createPaymentMode);

/**
 * @swagger
 *
 * /payments/update-paymentmode:
 *   put:
 *     summary: Update Payment Mode
 *     tags: [Payment Modes]
 *     parameters:
 *       - in: query
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
router.put('/update-paymentmode',operationsController.updatePaymentMode);

module.exports=router;