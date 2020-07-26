var express = require('express');
var router = express.Router();
//const authToken = require('../middleware/auth')
const detailsController = require('../controllers/details');
const usersController = require('../controllers/users');
const genToken = require('../util/generateToken');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */


router.get('/',detailsController.home_page);


//Users Routes

/**
 * @swagger
 * path:
 *   /users/user/{id}:
 *     get:
 *       summary: Returns a User by id
 *       tags: [Users]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of User to return
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
 *           description: The specified User ID is invalid (not a number).
 *         '404':
 *           description: A User with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/users/user/:id',usersController.getUserByID);

/**
 * @swagger
 * /users/allusers:
 *  get:
 *    summary: Returns all Users
 *    tags: [Users]
 *    description: Get all Users
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/users/allusers',usersController.getAllUsers);

/**
 * @swagger
 *
 * /users/createuser:
 *   post:
 *     summary: Add a User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *               uname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               user_role:
 *                 type: integer
 *               cellphone:
 *                 type: string
 *               blocked:
 *                 type: boolean
 *               create_userid:
 *                 type: integer
 *               useroutlets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer            
 *     responses:
 *       '201':
 *         description: created
 *       '400':
 *         description: Unexpected error
 */
router.post('/users/createuser',usersController.createUser);

/**
 * @swagger
 *
 * /users/updateuser/{id}:
 *   put:
 *     summary: Update a User
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of User to update
 *         shema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *               uname:
 *                 type: string
 *               email:
 *                 type: string
 *               user_role:
 *                 type: integer
 *               cellphone:
 *                 type: string
 *               blocked:
 *                 type: boolean
 *               archived:
 *                 type: boolean
 *               userid:
 *                 type: integer
 *               useroutlets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer            
 *     responses:
 *       '201':
 *         description: created
 *       '400':
 *         description: Unexpected error
 */
router.put('/users/updateuser/:id',usersController.updateUser);

// User Login

router.get('/users/login',usersController.login);
router.get('/users/register',usersController.register);

//User Categories route

/**
 * @swagger
 * /usercategory:
 *  get:
 *    summary: Returns all User Categories
 *    tags: [User Category]
 *    description: Get all User Categories
 *    responses:
 *      '200':
 *        description: OK
 *      '404':
 *        description: No records found
 *      '400':
 *        description: Unexpected error
 */
router.get('/usercategory',usersController.getUserCategories);

/**
 * @swagger
 * path:
 *   /usercategory/{id}:
 *     get:
 *       summary: Returns a User Category by id
 *       tags: [User Category]
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: id of User Category to return
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
 *           description: The specified User Category ID is invalid (not a number).
 *         '404':
 *           description: A User Category with the specified ID was not found.
 *         default:
 *           description: Unexpected error
 */
router.get('/usercategory/:id',usersController.getUserCategoryID);

/**
 * @swagger
 *
 * /usercategory:
 *   post:
 *     summary: Add New User Category
 *     tags: [User Category]
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
 *               createuser_id:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: created
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
router.post('/usercategory',usersController.createUserCategory);

/**
 * @swagger
 *
 * /usercategory/{id}:
 *   put:
 *     summary: Update User Category
 *     tags: [User Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of User Category to update
 *         shema:
 *           type: integer
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
 *       '402':
 *         description: failed
 *       '400':
 *         description: Unexpected error
 */
router.put('/usercategory/:id',usersController.updateUserCategory);

//User Types route
router.get('/usertypes',usersController.getUserRoles);
router.get('/usertypes/:id',usersController.getUserRolesByID);


//User outlets route
router.get('/useroutlets/:id',usersController.getUserOutletsByUserID);
router.post('/useroutlets/:id',usersController.updateUserOutletsByUserID);


// router.get('*', (req, res) =>
//   res
//     .status(404)
//     .json({ message: "Route does not exist", app: "Express-Routes" })
// );



module.exports=router;