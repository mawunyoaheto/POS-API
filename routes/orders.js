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
/**
 * @swagger
 * /orders:
 *  get:
 *    summary: Returns all Purchase Orders
 *    tags: [Purchase Orders]
 *    description: Get all Purchase Orders
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */

router.get('/orders',ordersController.getOrdersSummary);

/**
 * @swagger
 * path:
 *   /orders/{invoiceNo}:
 *     get:
 *       summary: Returns orders by invoiceNo
 *       tags: [Purchase Orders]
 *       parameters:
 *         - in: path
 *           name: invoiceNo
 *           required: true
 *           description: invoiceNo of order to return
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
 *           description: The specified invoiceNo is invalid (not a number).
 *         '404':
 *           description: An order with the specified invoiceNo was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/orders/:invoiceNo',ordersController.getOrdersSummary);

/**
 * @swagger
 *
 * /orders:
 *   post:
 *     summary: Create an order
 *     tags: [Purchase Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invoiceNum:
 *                 type: string
 *               awardNo:
 *                 type: string
 *               supplierID:
 *                 type: integer
 *               discount:
 *                 type: number
 *               vatID:
 *                 type: integer
 *               orderTerms:
 *                 type: string
 *               orderComments:
 *                 type: string
 *               outletID:
 *                 type: integer
 *               create_userid:
 *                 type: integer
 *               stageID:
 *                 type: integer
 *               statusID:
 *                 type: integer
 *               orderDate:
 *                 type: string
 *               orderTime:
 *                 type: string
 *               orderdetails:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemID:
 *                       type: integer
 *                     itemUnitID:
 *                       type: integer
 *                     qty:
 *                       type: integer
 *                     unitCost:
 *                       type: number
 *                     stockLevel:
 *                       type: integer
 *                     reOrderLevel:
 *                       type: integer
 *                     remark:
 *                       type: string
 *                     approvaLevelID:
 *                       type: integer
 *                     approvaSatusID:
 *                       type: integer
 *                     stageID:
 *                       type: integer
 *                     statusID:
 *                       type: integer
 *                     createTime:
 *                       type: string
 *     responses:
 *       '201':
 *         description: created
 *       '400':
 *         description: Unexpected error
 */
router.post('/orders',ordersController.createOrder);
router.post('/orderreceival',ordersController.createOrderReceival);


module.exports=router;