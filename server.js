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
const session = require('express-session');
const flash = require('express-flash');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
const initializePassport = require('./api/v1/util/passportconfig')
const config = require('./config');
const winston = require('./api/v1/util/winston');
const user_routes = require("./api/v1/routes/users");
//const userCatRoutes = require("./api/v1/routes/user_categories");
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
      title: "Point of Sale API",
      version: "1.0.0",
      description: "An API for KaziHub Point of Sale App ",
      contact: {
        name: "TELLESOFT"
      }
      //servers:["http://localhost:5001/api/v2"]
    },
    servers: [
      {
       url: 'http://{urlpath}:{port}{basePath}',
       description: 'The Test API server',
       variables: {
         urlpath: {
           default: 'localhost',
           description: 'this value is assigned by the service provider, in this example `gigantic-server.com`'
            },
            port: {
              enum: [
                '5002',
                '443',
                '8080'
              ],
              default: '5002'
            },
            basePath: {
              default: '/api/v1'
            }
          }
        }
      ],
     components:{
      securitySchemes: {
        bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
    security:{
      bearerAuth: []
    }
  },
    apis: ['./api/v1/routes/*.js']

}


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//app.set('trust proxy');

//initializePassport(passport)

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
})
);

app.set('view engine', 'ejs');
app.use(flash())
app.use(passport.initialize())
app.use(passport.session());
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

app.use('/api/v1/users',user_routes);
//app.use('/api/v1/userscat',us);
app.use('/api/v1/products',product_routes);
app.use('/api/v1/operations',operations_routes);
app.use('/api/v1/orders',orders_routes);
app.use('/api/v1/outlets',outlet_routes);
app.use('/api/v1/suppliers',suppliers_routes);
app.use('/api/v1/taxes',tax_routes);
app.use('/api/v1/moduletranstages',moduletranstages_routes);
app.use('/api/v1/payments',paymentmodes_routes);
app.use('/api/v1/epay',epayments_routes);
app.use('/api/v1/items',itembaseunit_routes);


// catch 404 and forward to error handler
app.use((err, req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

app.listen(config.port, function (req, res) {
  app.set('json spaces', 40);
  console.log(`Server running at http://${ config.host }:${ config.port }...`);
});
