var express = require('express');
var router = express.Router();
//const authToken = require('../middleware/auth')
const detailsController = require('../controllers/details');
const productsController = require('../controllers/products');
const genToken = require('../util/generateToken');


router.get('/',detailsController.home_page);


//product Catgeories routes

router.get('/product-category',productsController.getProductCategories);
router.get('/product-category/:id',productsController.getProductCategoryID);
router.post('/product-category',productsController.createPoductCategory);
router.put('/product-category/:id',productsController.updateProductCategory);


//products routes
router.get('/products',productsController.getProducts);
router.get('/products/:id',productsController.getProductByID);
router.post('/products',productsController.createPoduct);
router.put('/products/:id',productsController.updateProduct);

// router.get('*', (req, res) =>
//   res
//     .status(404)
//     .json({ message: "Route does not exist", app: "Express-Routes" })
// );



module.exports=router;