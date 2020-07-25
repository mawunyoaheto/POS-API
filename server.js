var express = require('express');
var bodyParser = require("body-parser");
const app = express();
var helmet = require('helmet');
const rateLimit = require('express-rate-limit')
const cors = require("cors");
var compression = require('compression');
var morgan = require('morgan');
var http = require('http');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const winston = require('./api/v1/util/winston')
const routes = require("./api/v1/routes/users");
const product_routes = require("./api/v1/routes/products");
const operations_routes = require("./api/v1/routes/operations");
const outlet_routes = require("./api/v1/routes/outlets");
const suppliers_routes = require("./api/v1/routes/suppliers");
const tax_routes = require("./api/v1/routes/tax");
const moduletranstages_routes = require("./api/v1/routes/modules_trans_stages");
const paymentmodes_routes = require("./api/v1/routes/payment_modes");
const itembaseunit_routes = require("./api/v1/routes/itembaseunit");
const epayments_routes = require("./api/v1/routes/e-payments");
const orders_routes = require("./api/v1/routes/orders");

//prevent DDOS by limiting the rate of request

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 5 requests,
})


const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "POS API",
      version: "1.0.0",
      description: "A POINT OF SALE API",
      contact: {
        name: "GENITICH SOLUTIONS"
      },
      servers: ["http://localhost:5002"]
    }
  },
    apis: ['./routes/*.js']

}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//app.set('trust proxy');
app.use(helmet());
app.use(limiter)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(morgan('combined', {
  stream: winston.stream
}));

// Routes which should handle requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use(cors());
app.use(compression());


//Users
app.use('/',routes);
app.use('/',product_routes);
app.use('/',operations_routes);
app.use('/',orders_routes);
app.use('/',outlet_routes);
app.use('/',suppliers_routes);
app.use('/',tax_routes);
app.use('/',moduletranstages_routes);
app.use('/',paymentmodes_routes);
app.use('/',epayments_routes);
app.use('/',itembaseunit_routes);
app.use('/usercategories', routes);
app.use('/add-user',routes);
app.use('/users',routes);
app.use('/users/:id',routes);
app.use('/deleteuser/:id',routes)
app.use('/usercategory',routes);
app.use('/usercategory/:id',routes);
app.use('/usertypes',routes); 
app.use('/usertypes/:id',routes); 
app.use('/useroutlets/:id',routes); 
app.use('/login',routes);
app.use('*',routes);

//Products

app.use('/product-category',product_routes);
app.use('/product-category/:id',product_routes);
app.use('/products',product_routes);
app.use('/products/:id',product_routes);
app.use('*',product_routes);


//OPERATIONS 

//Payment Modes
app.use('/payment-mode',paymentmodes_routes);
app.use('/payment-mode/:id',paymentmodes_routes);

//Outlet
app.use('/outlet',outlet_routes);
app.use('/outlet/:id',outlet_routes);

//Tax
app.use('/tax',tax_routes);
app.use('/tax/:id',tax_routes);

//Supplier
app.use('/supplier',suppliers_routes);
app.use('/supplier/:id',suppliers_routes);


//ORDERS
app.use('/orders',orders_routes);
app.use('/pendingorders',orders_routes);
app.use('/pendingorders/:invoiceNo',orders_routes);
app.use('/orderreceival',orders_routes);


//Supplier
app.use('/orderstatus',orders_routes);
app.use('/orderstatus/:id',orders_routes);

//E-Payment API setup
app.use('/e-payment',epayments_routes);
app.use('/e-payment/:id',epayments_routes);

//ItemBaseUnits
app.use('/itembaseunit',itembaseunit_routes);
app.use('/itembaseunit/:id',itembaseunit_routes);

//Modules
app.use('/modules',moduletranstages_routes);
app.use('/modules/:id',moduletranstages_routes);

//Module Transactions
app.use('/moduletrans',moduletranstages_routes);
app.use('/moduletrans/:id',moduletranstages_routes);

//Transaction Stages
app.use('/transtages',moduletranstages_routes);
app.use('/transtages/:id',moduletranstages_routes);

// catch 404 and forward to error handler
app.use((err, req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.listen(config.port, function (req, res) {
  app.set('json spaces', 40);
  console.log(`Server running at http://${ config.host }:${ config.port }...`);
});
