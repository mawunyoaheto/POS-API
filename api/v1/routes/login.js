var express = require('express');
var router = express.Router();
const passport = require('passport');
const detailsController = require('../controllers/details');
const loginController = require('../controllers/login')

router.get('/',detailsController.home_page);

router.get('/dashboard',detailsController.dashboard)

router.post('/users/login',loginController.login)

module.exports=router