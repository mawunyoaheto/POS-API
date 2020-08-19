
var express = require('express');
var router = express.Router();
//const authToken = require('../middleware/auth')
const detailsController = require('../controllers/details');
const suppliersController = require('../controllers/suppliers');
const genToken = require('../util/generateToken');
//Supplier routes

/**
 * @swagger
 * /suppliers/all-suppliers:
 *  get:
 *    summary: Returns all suppliers
 *    tags: [Suppliers]
 *    description: Get all Suppliers
 *    responses:
 *      '200':
 *        description: OK
 */
router.get('/all-suppliers',suppliersController.getSuppliers);

/**
 * @swagger
 * path:
 *   /suppliers/get-supplier/{id}:
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
router.get('/get-supplier/:id',suppliersController.getSupplierByID);

/**
 * @swagger
 *
 * /suppliers/add-supplier:
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
router.post('/add-supplier',suppliersController.createSupplier);

/**
 * @swagger
 * path:
 *   /suppliers/update-supplier/{id}:
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
router.put('/update-supplier/:id',suppliersController.updateSupplier);

module.exports=router;