var express = require('express');
var router = express.Router();
//const authToken = require('../middleware/auth')
const detailsController = require('../controllers/details');
const operationsController = require('../controllers/modules_trans_stages');
const genToken = require('../util/generateToken');


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