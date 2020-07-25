var express = require('express');
var router = express.Router();
//const authToken = require('../middleware/auth')
const detailsController = require('../controllers/details');
const operationsController = require('../controllers/operations');
const genToken = require('../util/generateToken');


/**
* @swagger
* tags:
*   name: Operations
*   description: Operations management
*/


router.get('/',detailsController.home_page);

module.exports=router;