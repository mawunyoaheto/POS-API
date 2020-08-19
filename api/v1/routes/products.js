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


//router.get('/',detailsController.home_page);


//products routes

/**
 * @swagger
 * /products/products:
 *  get:
 *    summary: Returns all products
 *    tags: [Products]
 *    description: Get all products
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
 *   /products/get-product/{id}:
 *     get:
 *       summary: Returns a product by id
 *       tags: [Products]
 *       parameters:
 *         - in: query
 *           name: productid
 *           required: true
 *           description: id of product to return
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
router.get('/get-product/:id',productsController.getProductByID);

/**
 * @swagger
 *
 * /products/add-product:
 *   post:
 *     summary: Add a new product
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
router.post('/add-product',productsController.createPoduct);

/**
 * @swagger
 * path:
 *   /products/update-product/{id}:
 *     put:
 *       summary: Updates a product by id
 *       tags: [Products]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of product to update
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
router.put('/update-product/:id',productsController.updateProduct);


//product Catgeories routes
/**
 * @swagger
 * /products/get-category:
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
router.get('/get-category',productsController.getProductCategories);

/**
 * @swagger
 * path:
 *   /products/get-category/{id}:
 *     get:
 *       summary: Returns a product category by id
 *       tags: [Product Category]
 *       parameters:
 *         - in: query
 *           name: catid
 *           required: true
 *           description: id of product category to return
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
router.get('/get-category/:id',productsController.getProductCategoryID);

/**
 * @swagger
 *
 * /products/add-category:
 *   post:
 *     summary: Add a product category
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
 *               userId:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: created
 *       '400':
 *         description: Unexpected error
 */
router.post('/add-category',productsController.createPoductCategory);

/**
 * @swagger
 * path:
 *   /products/update-category/{id}:
 *     put:
 *       summary: Updates a product category by id
 *       tags: [Product Category]
 *       parameters:
 *         - in: query
 *           name: catid
 *           required: true
 *           description: id of product category to update
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
 *                 userId:
 *                   type: integer
 *       responses:
 *         '201':
 *           description: updated
 *         '404':
 *           description: A Product Category with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.put('/update-category/:id',productsController.updateProductCategory);



module.exports=router;