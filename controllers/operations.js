var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var dbConfig = require('../config');


const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;
/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payments management
 */

/**
* @swagger
* tags:
*   name: Operations
*   description: Operations management
*/


/**
 * @swagger
 * /payment-mode:
 *  get:
 *    summary: Get all taxs
 *    tags: [Payments]
 *    description: Used to get all taxs
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function getPaymentModes(req, res) {

  const queryString ='select * from public.payment_modes'
  const pool = await db.dbConnection()

  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
        } else {
          return res.status(402).json({ 'message': 'failed with no records found' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }
}




/**
 * @swagger
 * path:
 *  /payment-mode/id:
 *    get:
 *      summary: Get a tax by id
 *      tags: [Payments]
 *      parameters:
 *          name: catID
 *          -in: path
 *          description: id of tax to fetch
 *          schema:
 *            type: string
 *          required: true
 *      responses:
 *        '200':
 *          description: A succesful response
 *          content:
 *            application/json:
 */

async function getPaymentModeByID(req, res) {

  const id = req.params.id
  const queryString=`select * FROM payment_modes WHERE id='${id}'`
  const pool = await db.dbConnection()

  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }

}



/**
 * @swagger
 * /payment-mode:
 *  post:
 *    summary: Add a new tax
 *    tags: [Payments]
 *    description: Used to create a tax
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function createPaymentMode(req, res) {

  const values = [
    req.body.description,
    req.body.isactive,
    moment(new Date()),
    req.body.userid
  ];
  const pool = await db.dbConnection()

  const createQuery = `INSERT INTO public.payment_modes(description, isactive, create_date, create_user_id)
        VALUES ('${req.body.description}', '${req.body.isactive}', '${moment(new Date())}', '${req.body.userid}')
        returning *`;

  try {

    pool.query(createQuery, function (err, recordset) {

      if (err) {

        return res.status(402).json('record insert failed with error: ' + helper.parseError(err, createQuery))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(201).json({ 'message': 'success' })
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()
  }
}


/**
* @swagger
* /payment-mode:
*  put:
*    summary: update a tax by ID
*    tags: [Payments]
*    description: Used to update a tax
*    responses:
*      '200':
*        description: A succesful response
*/

async function updatePaymentMode(req, res) {

  const id = req.params.id;
  const pool = await db.dbConnection();

  const values = [
    req.body.description,
    req.body.isactive,
    req.body.userid,
  ];
  
  const updateonequery = `UPDATE public.payment_modes SET description='${req.body.description}', 
    isactive='${req.body.isactive}', modified_date='${moment(new Date())}', modifier_id='${req.body.userid}'
	WHERE id = '${id}' returning *`;

  try {

    pool.query(updateonequery, function (err, recordset) {

      if (err) {

        return res.status(402).json('record update failed with error: ' + helper.parseError(err, updateonequery))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(201).json({ 'message': 'success' })
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }

};

//tax


/**
 * @swagger
 * /tax:
 *  get:
 *    summary: Get all tax
 *    tags: [Outlets]
 *    description: Used to get all tax
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function getOutlets(req, res) {

  const queryString='SELECT * FROM public.outlets'
  const pool = await db.dbConnection()

  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
        } else {
          return res.status(402).json({ 'message': 'failed with no records found' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }

}


//
/**
 * @swagger
 * path:
 *  /tax/id:
 *    get:
 *      summary: Get a tax by id
 *      tags: [Outlets]
 *      parameters:
 *          name: id
 *          -in: path
 *          description: id of tax to fetch
 *          schema:
 *            type: string
 *          required: true
 *      responses:
 *        '200':
 *          description: A succesful response
 *          content:
 *            application/json:
 */

async function getOutletsByID(req, res) {

  const id = req.params.id;
  const queryString = `select * FROM public.outlets WHERE id='${id}'`
  const pool = await db.dbConnection()

  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }

}



/**
 * @swagger
 * /outlet:
 *  post:
 *    summary: Add outlet tax
 *    tags: [Outlets]
 *    description: Used to create tax
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function createOutlet(req, res) {

  const values = [
    req.body.name,
    req.body.taxID,
    req.body.countryID,
    req.body.regionID,
    req.body.cityID,
    req.body.email,
    req.body.contactNumber,
    moment(new Date()),
    req.body.userid,
    req.body.isactive
  ];
  const pool = await db.dbConnection()

  const createQuery = `INSERT INTO public.outlets(name, tax_id, country, region, city, email, contactnumbers, create_date, 
    create_user, isactive)VALUES ('${req.body.name}', '${req.body.taxID}', '${req.body.countryID}', '${req.body.regionID}', 
    '${req.body.cityID}', '${req.body.email}', '${req.body.contactNumber}', '${moment(new Date())}', '${req.body.userid}', 
    '${req.body.isactive}') returning *`;
 

  try {

    pool.query(createQuery, function (err, recordset) {

      if (err) {

        return res.status(402).json('record insert failed with error: ' + helper.parseError(err, createQuery))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(201).json({ 'message': 'success' })
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()
  }
}


/**
* @swagger
* /outlet:
*  put:
*    summary: update an outlet by ID
*    tags: [Outlets]
*    description: Used to update an tax
*    responses:
*      '200':
*        description: A succesful response
*/

async function updateOutlet(req, res) {

  const id = req.params.id;
  const pool = await db.dbConnection();

  const values = [
    req.body.name,
    req.body.taxID,
    req.body.countryID,
    req.body.regionID,
    req.body.cityID,
    req.body.email,
    req.body.contactNumber,
    moment(new Date()),
    req.body.userid,
    req.body.isactive
  ];

  const updateonequery = `UPDATE public.outlets SET name='${req.body.name}', tax_id='${req.body.taxID}', 
    country='${req.body.countryID}', region='${req.body.regionID}', city='${req.body.cityID}', email='${req.body.email}', 
    contactnumbers='${req.body.contactNumber}', modified_date='${moment(new Date())}', modifier_userid='${req.body.userid}',
    isactive='${req.body.isactive}' WHERE id = '${id}' returning *`;

  try {

    pool.query(updateonequery, function (err, recordset) {

      if (err) {

        return res.status(402).json('record update failed with error: ' + helper.parseError(err, updateonequery))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(201).json({ 'message': 'success' })
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }
};

//TAXES

/**
 * @swagger
 * /tax:
 *  get:
 *    summary: Get all Taxes
 *    tags: [Tax]
 *    description: Used to get all taxes
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function getTax(req, res) {
  const queryString = 'SELECT * FROM public.taxes'
  const pool = await db.dbConnection()

  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }
}


/**
 * @swagger
 * path:
 *  /tax/id:
 *    get:
 *      summary: Get a tax by id
 *      tags: [Tax]
 *      parameters:
 *          name: id
 *          -in: path
 *          description: id of tax to fetch
 *          schema:
 *            type: string
 *          required: true
 *      responses:
 *        '200':
 *          description: A succesful response
 *          content:
 *            application/json:
 */

async function getTaxByID(req, res) {
  const id = req.params.id;
  const queryString = `SELECT * FROM public.taxes WHERE id ='${id}'`
  const pool = await db.dbConnection()

  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }

}


/**
 * @swagger
 * /tax:
 *  post:
 *    summary: Add new tax
 *    tags: [Tax]
 *    description: Used to create tax
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function createTax(req, res) {

  const values = [
    req.body.description,
    req.body.percentage,
    moment(new Date()),
    req.body.userid,
    req.body.isactive
  ];

  const pool = await db.dbConnection()

  const createQuery = `INSERT INTO public.taxes(description, percentage, create_date, create_user, isactive) 
    VALUES ('${req.body.description}', '${req.body.percentage}', '${moment(new Date())}', '${req.body.userid}',
    '${req.body.isactive}') returning *`;


  try {

    pool.query(createQuery, function (err, recordset) {

      if (err) {

        return res.status(402).json('record insert failed with error: ' + helper.parseError(err, createQuery))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(201).json({ 'message': 'success' })
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }
}


/**
* @swagger
* /outlet:
*  put:
*    summary: update an tax by ID
*    tags: [Outlets]
*    description: Used to update an tax
*    responses:
*      '200':
*        description: A succesful response
*/

async function updateTax(req, res) {

  const id = req.params.id;
  const pool = await db.dbConnection();

  const values = [
    req.body.description,
    req.body.percentage,
    moment(new Date()),
    req.body.userid,
    req.body.isactive
  ];

  const updateonequery = `UPDATE public.taxes SET description='${req.body.description}', percentage='${req.body.percentage}', 
    modified_date='${moment(new Date())}', modifier_userid='${req.body.userid}', isactive='${req.body.isactive}' WHERE id = '${id}' returning *`;

  try {

    pool.query(updateonequery, function (err, recordset) {

      if (err) {

        return res.status(402).json('record update failed with error: ' + helper.parseError(err, updateonequery))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(201).json({ 'message': 'success' })
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }

};


//SUPPLIERS

/**
* @swagger
* /supplier:
*  get:
*    summary: Get all Suppliers
*    tags: [Suppliers]
*    description: Used to get all suppliers
*    responses:
*      '200':
*        description: A succesful response
*/

async function getSuppliers(req, res) {
  const queryString = 'SELECT * FROM public.suppliers'
  const pool = await db.dbConnection()

  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

        //res.status(200).json(recordset.rows);

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }
}

/**
* @swagger
* path:
*  /supplier/id:
*    get:
*      summary: Get a supplier by id
*      tags: [Suppliers]
*      parameters:
*          name: id
*          -in: path
*          description: id of supplier to fetch
*          schema:
*            type: string
*          required: true
*      responses:
*        '200':
*          description: A succesful response
*          content:
*            application/json:
*/

async function getSupplierByID(req, res) {
  const id = req.params.id;
  const pool = await db.dbConnection()
  const query = `SELECT * FROM public.suppliers WHERE id ='${id}'`

  try {

    pool.query(query, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not found with error: ' + helper.parseError(err, query))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }

}


/**
* @swagger
* /supplier:
*  post:
*    summary: Add new supplier
*    tags: [Suppliers]
*    description: Used to create supplier
*    responses:
*      '200':
*        description: A succesful response
*/

async function createSupplier(req, res) {

  const pool = await db.dbConnection()

  const createQuery = `INSERT INTO public.suppliers(name, address, phone_number, email, create_date, create_user_id, 
        isactive) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *`;

  const values = [
    req.body.name,
    req.body.address,
    req.body.phonenumber,
    req.body.email,
    moment(new Date()),
    req.body.userid,
    req.body.isactive
  ];

  try {

    pool.query(createQuery, function (err, recordset) {

      if (err) {

        return res.status(402).json('record insert failed with error: ' + helper.parseError(err, createQuery))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(201).json({ 'message': 'success' })
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }
}


/**
* @swagger
* /supplier/id:
*  put:
*    summary: update a supplier by ID
*    tags: [Suppliers]
*    description: Used to update a supplier
*    responses:
*      '200':
*        description: A succesful response
*/

async function updateSupplier(req, res) {

  const id = req.params.id;
  const pool = await db.dbConnection();

  const values = [
    req.body.name,
    req.body.address,
    req.body.phonenumber,
    req.body.email,
    moment(new Date()),
    req.body.userid,
    req.body.isactive
  ];

  console.log(values)
  //const findonequery = 'SELECT * FROM public.suppliers WHERE id = ($1)';
  const updateonequery = `UPDATE public.suppliers SET name='${req.body.name}', address='${req.body.address}', 
    phone_number='${req.body.phonenumber}', email='${req.body.email}', isactive='${req.body.isactive}', 
    modified_date='${moment(new Date())}', modifier_user_id='${req.body.userid}' WHERE id = '${id}' returning *`;

  try {

    pool.query(updateonequery, function (err, recordset) {

      if (err) {

        return res.status(402).json('record update failed with error: ' + helper.parseError(err, updateonequery))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(201).json({ 'message': 'success' })
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }
};


/**
* @swagger
* /payment-mode:
*  get:
*    summary: Get all epaymentPayLoad types
*    tags: [Payments]
*    description: Used to get all epaymentPayLoad types
*    responses:
*      '200':
*        description: A succesful response
*/

async function getEpaymentPayloadTypes(req, res) {

  const queryString = 'SELECT * FROM public.epaymentloadtypes'
  const pool = await db.dbConnection()

  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
        } else {
          return res.status(402).json('record not found')
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }

}

/**
 * @swagger
 * /e-Payment:
 *  post:
 *    summary: Add E-Payment Gateway setup
 *    tags: [E-Payment]
 *    description: Used to E-Payment Gateway setup
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function createEpaymentAPI(req, res) {

  const pool = await db.dbConnection()

  const createQuery = `INSERT INTO public.epaymentapisetup(description, reaquesturl, statusurl, payloadtypeid, apikey, secretkey, 
    userid, code, requestbody, statusbody, active, usermachinename, usermachineip, createuserid)VALUES ($1, $2, $3, $4, $5, $6, $7, 
    $8, $9, $10, $11, $12, $13, $14) returning *`;

  const values = [
    req.body.description,
    req.body.requesturl,
    req.body.statusurl,
    req.body.payloadtypeid,
    req.body.apikey,
    req.body.secretkey,
    req.body.userid,
    req.body.code,
    req.body.requestbody,
    req.body.statusbody,
    req.body.isactive,
    userMachineName,
    userMachineIP,
    req.body.userid,

  ];

  try {

    pool.query(createQuery, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not created with error: ' + helper.parseError(err, queryString))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(201).json({ 'message': 'success' })
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }

}

/**
 * @swagger
 * /payment-mode:
 *  get:
 *    summary: Get all taxs
 *    tags: [Payments]
 *    description: Used to get all taxs
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function getEpaymentAPI(req, res) {
  const queryString = 'select * from public.epaymentapisetup'
  const pool = await db.dbConnection()
  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
        } else {
          return res.status(402).json('record not found')
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }

}


/**
 * @swagger
 * path:
 *  /e-paymentapi/id:
 *    get:
 *      summary: Get e-payment setup by id
 *      tags: [E-Payments]
 *      parameters:
 *          name: catID
 *          -in: path
 *          description: id of e-payment to fetch
 *          schema:
 *            type: string
 *          required: true
 *      responses:
 *        '200':
 *          description: A succesful response
 *          content:
 *            application/json:
 */

async function getEpaymentAPIByID(req, res) {
  const id = req.params.id;
  const pool = await db.dbConnection()

  const queryString = `select * FROM public.epaymentapisetup WHERE id=${id}`

  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
        } else {
          return res.status(402).json('record not found')
        }
      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }

}

// async function getEPaymentAPIID(req, res) {
//   const id = req.params.id;
//   const pool = await db.dbConnection()
//   const queryString = `select * FROM public.epaymentapisetup WHERE id=${id}`

//   try {

//     pool.query(queryString, function (err, recordset) {

//       if (err) {

//         return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

//       } else {
//         if (recordset.rows.length > 0) {
//           // send records as a response
//           return res.status(200).json(recordset.rows)
//         } else {
//           return res.status(402).json('record not found')
//         }

//       }
//     });

//   } catch (error) {
//     console.log(error);
//     res.end()

//   }

// }

/**
 * @swagger
 * /E-payment:
 *  put:
 *    summary: update e-payment setup by ID
 *    tags: [E-Payments]
 *    description: Used to update e-payment setup
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function updateEpaymentAPI(req, res) {

  const id = req.params.id;
  const pool = await db.dbConnection();

  const values = [
    req.body.description,
    req.body.requesturl,
    req.body.statusurl,
    req.body.payloadtypeid,
    req.body.apikey,
    req.body.secretkey,
    req.body.apiuserid,
    req.body.code,
    req.body.requestbody,
    req.body.statusbody,
    req.body.isactive,
    usermachinename = 'DESKTOP',
    usermachineip = '127.0.0.1',
    req.body.createuserid
  ];
  console.log(values)
  const findonequery = 'SELECT * FROM public.epaymentapisetup WHERE id = ($1)';
  //console.log(values)
  const updateonequery = `UPDATE public.epaymentapisetup SET description ='${req.body.description}', requesturl='${req.body.requesturl}',
   statusurl='${req.body.statusurl}', payloadtypeid='${req.body.payloadtypeid}', apikey='${req.body.apikey}', secretkey='${req.body.secretkey}', 
   userid='${req.body.apiuserid}', code='${req.body.code}', requestbody='${req.body.requestbody}', statusbody='${req.body.statusbody}', 
   active='${req.body.isactive}', usermachinename='${usermachinename}', usermachineip='${usermachineip}', updatetime='${moment(new Date())}', 
   updateuserid='${req.body.createuserid}' WHERE id = '${id}' returning *`;

  const confirmed = await helper.confirmRecord(findonequery, id);

  if (confirmed) {

    try {
      //update is done here
      await pool.query(updateonequery, (err, resp, next) => {

        if (err) {
          helper.parseError(err, updateonequery)

          // Pool result will be undefined
          console.log("SQL result:", res);

        } else {
          res.status(201).json({ 'message': 'updated succesfully' });

        }
      });


    } catch (error) {
      console.log('UPDATE-ERROR', error)
      throw error
    }


  } else {

    res.status(404).json({ 'message': 'Update failed: record does not exist' });

  }

};




async function getItemBaseUnits(req, res) {
  const queryString = 'select * from public.itembaseunits'
  const pool = await db.dbConnection()
  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).send(recordset.rows)
        } else {
          return res.status(402).json('record not found')
        }

      }
    });

  } catch (error) {
    return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))
  }

}


async function getItemBaseUnitByID(req, res) {
  const id = req.params.id;
  
  const pool = await db.dbConnection()

  const queryString = `select * FROM public.itembaseunits WHERE id=${id}`

  try {

    pool.query(queryString, function (err, recordset) {

      console.log(id)
        //if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
       // } else {
        //  return res.status(402).json('record not found')
       // }
      
    });

  } catch (error) {
    return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

  }

}



/**
 * @swagger
 * /itembaseunit:
 *  post:
 *    summary: Add new Item Base Unit
 *    tags: [ItemBaseUnit]
 *    description: Used to create Item Base Unit
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function createItemBaseUnit(req, res) {

  const pool = await db.dbConnection()

  const createQuery = `INSERT INTO public.itembaseunits(baseunit, isactive, create_user, usermachinename, usermachineip) 
  VALUES ($1, $2, $3, $4, $5) returning *`;
  

  try {

    //await pool.query('BEGIN')

    //for (var i = 0; i < req.body.length; i++) {

      const values = [
        req.body.baseunit,
        req.body.isactive,
        userid,
        userMachineName,
        userMachineIP
      ];

      console.log(req.body.baseunit,req.body.isactive)
     await pool.query(createQuery,values ) 
  
    //}
    //await pool.query('COMMIT')
    return res.status(201).json({ 'message': 'success' })
  

  } catch (error) {

    pool.query('ROLLBACK')
    return res.status(402).json('record insert failed with error: ' + helper.parseError(error, createQuery))

  }
}

/**
 * @swagger
 * /itembaseunit:
 *  put:
 *    summary: update itembaseunit setup by ID
 *    tags: [E-Payments]
 *    description: Used to update e-payment setup
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function updateItemBaseUnit(req, res,err) {

  const id = req.params.id;
  const pool = await db.dbConnection();

  const values = [
    req.body.baseunit,
    req.body.isactive,
    userid,
    userMachineName,
    userMachineIP
  ];

  //const findonequery = 'SELECT * FROM public.epaymentapis WHERE id = ($1)';

  const updateonequery = `UPDATE public.itembaseunits SET baseunit='${req.body.baseunit}', isactive='${req.body.isactive}', modified_date='${moment(new Date())}', 
  modifier_userid='${userid}', usermachinename='${userMachineName}', usermachineip='${userMachineIP}' WHERE id = '${id}' returning *`

    try {
    
      await pool.query(updateonequery)
      return res.status(201).json({ 'message': 'success' })

    } catch (err) {
      return res.status(402).json('record insert failed with error: ' + helper.parseError(err, updateonequery))
    }

}


module.exports = {
  getPaymentModes,
  getPaymentModeByID,
  createPaymentMode,
  updatePaymentMode,
  getOutlets,
  getOutletsByID,
  createOutlet,
  updateOutlet,
  getTax,
  getTaxByID,
  createTax,
  updateTax,
  getSuppliers,
  getSupplierByID,
  createSupplier,
  updateSupplier,
  getEpaymentPayloadTypes,
  createEpaymentAPI,
  getEpaymentAPI,
  getEpaymentAPIByID,
  updateEpaymentAPI,
  getItemBaseUnits,
  getItemBaseUnitByID,
  createItemBaseUnit,
  updateItemBaseUnit

}