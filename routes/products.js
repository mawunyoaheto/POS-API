var express = require('express');
var router = express.Router();
//const authToken = require('../middleware/auth')
const detailsController = require('../controllers/details');
const productsController = require('../controllers/products');
const genToken = require('../util/generateToken');


/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products management
 */


router.get('/',detailsController.home_page);


//product Catgeories routes
/**
 * @swagger
 * /product-category:
 *  get:
 *    summary: Returns all Product Categories
 *    tags: [Product Category]
 *    description: Get all Product Categories
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/product-category',productsController.getProductCategories);

/**
 * @swagger
 * path:
 *   /product-category/{id}:
 *     get:
 *       summary: Returns a Product Category by id
 *       tags: [Product Category]
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
 *           description: The specified Product Category ID is invalid (not a number).
 *         '404':
 *           description: A Product Category with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/product-category/:id',productsController.getProductCategoryID);

/**
 * @swagger
 *
 * /product-category:
 *   post:
 *     summary: Add a Product Category
 *     tags: [Product Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               isactive:
 *                 type: boolean
 *               userid:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: created
 *       '400':
 *         description: Unexpected error
 */
router.post('/product-category',productsController.createPoductCategory);

/**
 * @swagger
 * path:
 *   /product-category/{id}:
 *     put:
 *       summary: Updates a Product Category by id
 *       tags: [Product Category]
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
 *                 category:
 *                   type: string
 *                 isactive:
 *                   type: boolean
 *                 userid:
 *                   type: integer
 *       responses:
 *         '201':
 *           description: updated
 *         '404':
 *           description: A Product Category with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.put('/product-category/:id',productsController.updateProductCategory);


//products routes

/**
 * @swagger
 * /products:
 *  get:
 *    summary: Returns all Product Categories
 *    tags: [Products]
 *    description: Get all Product Categories
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/products',productsController.getProducts);

/**
 * @swagger
 * path:
 *   /products/{id}:
 *     get:
 *       summary: Returns a Product by id
 *       tags: [Products]
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
 *           description: The specified Product ID is invalid (not a number).
 *         '404':
 *           description: A Product with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/products/:id',productsController.getProductByID);

/**
 * @swagger
 *
 * /products:
 *   post:
 *     summary: Add a Product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               ext_description:
 *                 type: string
 *               product_code:
 *                 type: string
 *               cost_price:
 *                 type: double
 *               s_price:
 *                 type: double
 *               category_id:
 *                 type: integer
 *               isactive:
 *                 type: boolean
 *               userid:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: created
 *       '400':
 *         description: Unexpected error
 */
router.post('/products',productsController.createPoduct);

/**
 * @swagger
 * path:
 *   /products/{id}:
 *     put:
 *       summary: Updates a Product by id
 *       tags: [Products]
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
 *                 description:
 *                 type: string
 *               ext_description:
 *                 type: string
 *               product_code:
 *                 type: string
 *               cost_price:
 *                 type: double
 *               s_price:
 *                 type: double
 *               category_id:
 *                 type: integer
 *               isactive:
 *                 type: boolean
 *               userid:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: created
 *       '400':
 *         description: Unexpected error
 */
router.put('/products/:id',productsController.updateProduct);



module.exports=router;