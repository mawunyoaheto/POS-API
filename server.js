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
const winston = require('./util/winston')
const routes = require("./routes/users");
const product_routes = require("./routes/products");
const operations_routes = require("./routes/operations");
const orders_routes = require("./routes/orders");

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
app.use('/', routes);
app.use('/',product_routes);
app.use('/',operations_routes);
app.use('/',orders_routes);
app.use('/usercategories', routes);
app.use('/add-user',routes);
app.use('/users',routes);
app.use('/users/:id',routes);
app.use('/deleteuser/:id',routes)
app.use('/usercategory',routes);
app.use('/usercategory/:id',routes);
app.use('/usertypes',routes); 
app.use('/usertypes/:id',routes); 
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
app.use('/payment-mode',operations_routes);
app.use('/payment-mode/:id',operations_routes);

//Outlet
app.use('/outlet',operations_routes);
app.use('/outlet/:id',operations_routes);

//Tax
app.use('/tax',operations_routes);
app.use('/tax/:id',operations_routes);

//Supplier
app.use('/supplier',operations_routes);
app.use('/supplier/:id',operations_routes);


//ORDERS
app.use('/orders',orders_routes);
app.use('/orderreceival',orders_routes);

//Supplier
app.use('/orderstatus',orders_routes);
app.use('/orderstatus/:id',orders_routes);

//E-Payment API setup
app.use('/e-payment',operations_routes);
app.use('/e-payment/:id',operations_routes);

//ItemBaseUnits
app.use('/itembaseunit',operations_routes);
app.use('/itembaseunit/:id',operations_routes);

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
