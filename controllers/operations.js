var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');



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
  
    const pool = await db.dbConnection()
  
    try {
  
      pool.query('select * from payment_modes', function (err, recordset) {
  
        if (err) {
  
          console.log(err)
  
        } else {
  
          // send records as a response
          res.status(200).json(recordset.rows);
        }
      });
  
  
    } catch (error) {
  
      console.log(error)
  
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

async function getPaymentModeByID(id, res) {

    const pool = await db.dbConnection()
  
    try {
  
      const recordset = await pool.query(`select * FROM payment_modes WHERE id='${id}'`)
  
      if (recordset.rowsAffected > 0) {
        return res.status(200).json( recordset.recordset[0].category)
        //console.log('userCategory-id', recordset.recordset[0].id)
      } else {
        return {
          message: 'No record found'
        }
  
      }
  
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

    const pool = await db.dbConnection()
  
    const createQuery = `INSERT INTO public.payment_modes(description, isactive, create_date, create_user_id)
        VALUES ($1, $2, $3, $4)
        returning *`;
    const values = [
      req.body.description,
      req.body.isactive,
      moment(new Date()),
      req.body.userid
    ];
  
      try {
      const { rows } = await pool.query(createQuery, values);
  
      return res.status(201).send({ 'message': 'tax created succesfully' });
  
    } catch (error) {
  
      res.status(400).send(error);
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
      id
    ];
    const findonequery = 'SELECT * FROM payment_modes WHERE id = ($1)';
    const updateonequery = `UPDATE public.payment_modes SET description='${req.body.description}', 
    isactive='${req.body.isactive}', modified_date='${moment(new Date())}', modifier_id='${req.body.userid}'
	' WHERE id = '${id}' returning *`;
  
   //const confirmed = await confirmRecord(findonequery, id);
    const confirmed = await helper.confirmRecord(findonequery, id);
    if (confirmed) {
  
      try {
        //update is done here
        await pool.query(updateonequery, (err, res, next) =>{
  
          //console.log(res.rows)
         
        });
        
        res.status(201).json({ 'message': 'updated succesfully' });
      } catch (error) {
        console.log('UPDATE-ERROR',error)
        res.status(404).json({ 'error': error });
      }
  
      //res.status(200).json({ 'message': 'record found' })
  
    } else {
  
      res.status(404).json({ 'message': 'Update failed: record does not exist' });
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
  
    const pool = await db.dbConnection()
  
    try {
  
      pool.query('select * from tax', function (err, recordset) {
  
        if (err) {
  
          console.log(err)
  
        } else {
  
          // send records as a response
          res.status(200).json(recordset.rows);
        }
      });
  
  
    } catch (error) {
  
      console.log(error)
  
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

async function getOutletsByID(id, res) {

    const pool = await db.dbConnection()
  
    try {
  
      const recordset = await pool.query(`select * FROM tax WHERE id='${id}'`)
  
      if (recordset.rowsAffected > 0) {
        return res.status(200).json( recordset.recordset[0].category)
        //console.log('userCategory-id', recordset.recordset[0].id)
      } else {
        return {
          message: 'No record found'
        }
  
      }
  
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

    const pool = await db.dbConnection()
  
    const createQuery = `INSERT INTO public.tax(name, tax_id, country, region, city, email, 
        contactnumbers, create_date, create_user, isactive)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        returning *`;
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
  
      try {
      const { rows } = await pool.query(createQuery, values);
  
      return res.status(201).send({ 'message': 'created succesfully' });
  
    } catch (error) {
  
      res.status(400).send(error);
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
    const findonequery = 'SELECT * FROM payment_modes WHERE id = ($1)';
    const updateonequery = `UPDATE public.tax SET name='${req.body.name}', tax_id='${req.body.taxID}', 
    country='${req.body.countryID}', region='${req.body.regionID}', city='${req.body.cityID}', email='${req.body.email}', 
    contactnumbers='${req.body.contactNumber}', modified_date='${moment(new Date())}', modifier_userid='${req.body.userid}',
    isactive='${req.body.isactive}' WHERE id = '${id}' returning *`;
  
    const confirmed = await helper.confirmRecord(findonequery, id);
    if (confirmed) {
  
      try {
        //update is done here
        await pool.query(updateonequery, (err, res, next) =>{
  
          //console.log(res.rows)
         
        });
        
        res.status(201).json({ 'message': 'updated succesfully' });
      } catch (error) {
        console.log('UPDATE-ERROR',error)
        res.status(404).json({ 'error': error });
      }
  
      //res.status(200).json({ 'message': 'record found' })
  
    } else {
  
      res.status(404).json({ 'message': 'Update failed: record does not exist' });
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
  
    const pool = await db.dbConnection()
  
    try {
  
      pool.query('SELECT * FROM public.taxes', function (err, recordset) {
  
        if (err) {
  
          console.log(err)
  
        } else {
  
          // send records as a response
          res.status(200).json(recordset.rows);
        }
      });
  
  
    } catch (error) {
  
      console.log(error)
  
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
    const pool = await db.dbConnection()
  
    try {
  
        pool.query(`SELECT * FROM public.taxes WHERE id ='${id}'`, function (err, recordset) {
  
            if (err) {
                return res.status(402).json( 'record not found')
      
            } else {
      
                
                    // send records as a response
                    return res.status(200).json( recordset.rows)
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

    const pool = await db.dbConnection()
  
    const createQuery = `INSERT INTO public.taxes(description, percentage, create_date, create_user,
    isactive) VALUES ($1, $2, $3, $4, $5) returning *`;

    const values = [
      req.body.description,
      req.body.percentage,
      moment(new Date()),
      req.body.userid,
      req.body.isactive
    ];
  
      try {
      const { rows } = await pool.query(createQuery, values);
  
      return res.status(201).send({ 'message': 'created succesfully' });
  
    } catch (error) {
  
      res.status(400).send(error);
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
    const findonequery = 'SELECT * FROM taxes WHERE id = ($1)';
    const updateonequery = `UPDATE public.taxes SET description='${req.body.description}', percentage='${req.body.percentage}', 
    modified_date='${moment(new Date())}', modifier_userid='${req.body.userid}', isactive='${req.body.isactive}' WHERE id = '${id}' returning *`;
  
    const confirmed = await helper.confirmRecord(findonequery, id);
    if (confirmed) {
  
      try {
        //update is done here
        await pool.query(updateonequery, (err, res, next) =>{
  
          //console.log(res.rows)
         
        });
        
        res.status(201).json({ 'message': 'updated succesfully' });
      } catch (error) {
        console.log('UPDATE-ERROR',error)
        res.status(404).json({ 'error': error });
      }
  
      //res.status(200).json({ 'message': 'record found' })
  
    } else {
  
      res.status(404).json({ 'message': 'Update failed: record does not exist' });
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
  
    const pool = await db.dbConnection()
  
    try {
  
      pool.query('SELECT * FROM public.suppliers', function (err, recordset) {
  
        if (err) {
  
          console.log(err)
  
        } else {
  
          // send records as a response
          res.status(200).json(recordset.rows);
        }
      });
  
  
    } catch (error) {
  
      console.log(error)
  
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

async function getSupplierID(req, res) {
    const id = req.params.id;
    const pool = await db.dbConnection()
  
    try {
  
        pool.query(`SELECT * FROM public.suppliers WHERE id ='${id}'`, function (err, recordset) {
  
            if (err) {
                return res.status(402).json( 'record not found')
      
            } else {
      
                
                    // send records as a response
                    return res.status(200).json( recordset.rows)
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
      const { rows } = await pool.query(createQuery, values);
  
      return res.status(201).send({ 'message': 'created succesfully' });
  
    } catch (error) {
  
      res.status(400).send(error);
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
    const findonequery = 'SELECT * FROM public.suppliers WHERE id = ($1)';
    const updateonequery = `UPDATE public.suppliers SET name='${req.body.name}', address='${req.body.address}', 
    phone_number='${req.body.phonenumber}', email='${req.body.email}', isactive='${req.body.isactive}', 
    modified_date='${moment(new Date())}', modifier_user_id='${req.body.userid}' WHERE id = '${id}' returning *`;
  
    const confirmed = await helper.confirmRecord(findonequery, id);
    if (confirmed) {

      try {
        //update is done here
        //console.log(req.body.description)
        await pool.query(updateonequery, (err, res, next) =>{
  
          //console.log(res.rows)
         
        });
        
  res.status(201).json({ 'message': 'updated succesfully' });
      } catch (error) {
        console.log('UPDATE-ERROR',error)
        res.status(404).json({ 'error': error });
      }
  
      //res.status(200).json({ 'message': 'record found' })
  
    } else {
  
      res.status(404).json({ 'message': 'Update failed: record not found' });
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
  
  const pool = await db.dbConnection()

  try {

    pool.query('SELECT * FROM public.epaymentloadtypes', function (err, recordset) {

      if (err) {

        console.log(err)

      } else {

        // send records as a response
        res.status(200).json(recordset.rows);
      }
    });


  } catch (error) {

    console.log(error)

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
    const { rows } = await pool.query(createQuery, values);

    return res.status(201).send({ 'message': 'created succesfully' });

  } catch (error) {

    res.status(400).send(error);
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
  
  const pool = await db.dbConnection()

  try {

    pool.query('select * from public.epaymentapisetup', function (err, recordset) {

      if (err) {

        console.log(err)

      } else {

        // send records as a response
        res.status(200).json(recordset.rows);
      }
    });


  } catch (error) {

    console.log(error)

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

async function getEpaymentAPIByID(id, res) {

  const pool = await db.dbConnection()

  try {

    const recordset = await pool.query(`select * FROM public.epaymentapisetup WHERE id='${id}'`)

    if (recordset.rowsAffected > 0) {
      return res.status(200).json( recordset.recordset[0].category)
      //console.log('userCategory-id', recordset.recordset[0].id)
    } else {
      return {
        message: 'No record found'
      }

    }

  } catch (error) {
    console.log(error);
    res.end()

  }

}

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
    usermachinename ='DESKTOP',
    usermachineip='127.0.0.1',
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
     await pool.query(updateonequery, (err, resp, next) =>{
       
      if (err) {
        helper.parseError(err, updateonequery)

        // Pool result will be undefined
        console.log("SQL result:", res);

      } else {
       res.status(201).json({ 'message': 'updated succesfully' });
 
      }
      });
      

     } catch (error) {
      console.log('UPDATE-ERROR',error)
      throw error
     }


  } else {

  res.status(404).json({ 'message': 'Update failed: record does not exist' });

   }

};

module.exports={
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
    getSupplierID,
    createSupplier,
    updateSupplier,
    getEpaymentPayloadTypes,
    createEpaymentAPI,
    getEpaymentAPI,
    getEpaymentAPIByID,
    updateEpaymentAPI

}