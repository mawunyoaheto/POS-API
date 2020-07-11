var express = require('express');
var router = express.Router();
//const authToken = require('../middleware/auth')
const detailsController = require('../controllers/details');
const taxController = require('../controllers/tax');
const genToken = require('../util/generateToken');


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
router.get('/tax',taxController.getTax);

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
router.get('/tax/:id',taxController.getTaxByID);

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
router.post('/tax',taxController.createTax);

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
router.put('/tax/:id',taxController.updateTax);

module.exports=router;