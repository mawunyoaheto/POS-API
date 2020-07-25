var express = require('express');
var router = express.Router();
//const authToken = require('../middleware/auth')
const detailsController = require('../controllers/details');
const operationsController = require('../controllers/itembaseunit');
const genToken = require('../util/generateToken');


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


module.exports=router;