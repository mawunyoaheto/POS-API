var express = require('express');
var router = express.Router();
//const authToken = require('../middleware/auth')
const detailsController = require('../controllers/details');
const usersController = require('../controllers/users');
const genToken = require('../util/generateToken');


router.get('/',detailsController.home_page);


//Users Routes
router.get('/users/:id',usersController.getUserByID);
router.get('/users',usersController.getAllUsers);
router.post('/users',usersController.createUser);
router.put('/deleteuser/:id',usersController.deleteUser);

// User Login
router.post('/login',usersController.login);

//User Categories route
router.get('/usercategory',usersController.getUserCategories);
router.get('/usercategory/:id',usersController.getUserCategoryID);
router.post('/usercategory',usersController.createUserCategory);
router.put('/usercategory/:id',usersController.updateUserCategory);

//User Types route
router.get('/usertypes',usersController.getUserRoles);
router.get('/usertypes/:id',usersController.getUserRolesByID);

// router.get('*', (req, res) =>
//   res
//     .status(404)
//     .json({ message: "Route does not exist", app: "Express-Routes" })
// );



module.exports=router;