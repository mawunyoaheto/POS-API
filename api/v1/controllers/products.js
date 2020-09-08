var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var respBody=require('../util/response');
var dbConfig = require('../../../config');
const Response = require('../util/response');
const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;




var productsRes = {};

//GET ALL PRODUCT CATEGORIES
async function getProductCategories(req, res, error) {
  var resp = new Response.Response(res);
  //var getAllProductCatRes = {};


  const pool = await db.dbConnection()

  try {

    pool.query('select * from product_categories', function (err, recordset) {

      if (recordset.rowCount > 0) {
  
        productsRes= respBody.ResponseBody('success',recordset.rows,recordset.rows.length + ' record(s) found');
        resp.json(200, productsRes);

      } else {
  
        productsRes= respBody.ResponseBody('success',recordset.rows,recordset.rows.length + ' record(s) found');
        resp.json(404, productsRes);
      }
    });

  } catch (error) {
 
    productsRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
    resp.json(404, productsRes);
  }

};


//GET PRODUCT CATEGORY BY ID
async function getProductCategoryID(req, res, error) {
  var resp = new Response.Response(res);
  var catID = req.query.catid;
  const pool = await db.dbConnection()

  try {

  var recordset = await pool.query(`select * FROM product_categories WHERE id ='${catID}'`);

    if (recordset.rowCount > 0) {
      // send records as a response
      productsRes= respBody.ResponseBody('success',recordset.rows,recordset.rows.length + ' record(s) found');
        resp.json(200, productsRes);

    } else {
     // return res.status(404).json({ 'message': 'failed' })
      
      productsRes= respBody.ResponseBody('success',recordset.rows,recordset.rows.length + ' record(s) found');
      resp.json(404, productsRes);

    }


  } catch (error) {
    //return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
    productsRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
    resp.json(404, productsRes);
  }

}



//CREATE PRODUCT CATEGORY
async function createPoductCategory(req, res, error) {
  var resp = new Response.Response(res);
  const pool = await db.dbConnection()

  const createQuery = `INSERT INTO public.product_categories(category, isactive, create_userid, create_date, usermachinename, usermachineip) 
    VALUES ( $1, $2, $3, $4, $5, $6) returning *`;

  const values = [
    req.body.category,
    req.body.isactive,
    req.body.userId,
    moment(new Date()),
    userMachineName,
    userMachineIP
  ];

  try {

    const row_count = await pool.query(createQuery, values);

    if (row_count.rowCount > 0) {
      // send records as a response
     // return res.status(201).json({ 'message': 'success' })

      productsRes= respBody.ResponseBody('success',row_count.rows,row_count.rowCount + ' record(s) found');
      resp.json(201, productsRes);

    } else {
  
      productsRes= respBody.ResponseBody('success',row_count.rows,row_count.rowCount + ' record(s) found');
      resp.json(404, productsRes);
    }

  } catch (error) {
    productsRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error,createQuery));
    resp.json(404, productsRes);
  }
}



//UPDATE PRODUCT CATEGORY
async function updateProductCategory(req, res, error) {
  var resp = new Response.Response(res);
  const catID = req.query.catid;
  const pool = await db.dbConnection();

  const values = [
    req.body.category,
    req.body.isactive,
    req.body.userId,
    moment(new Date()),
    userMachineName,
    userMachineIP
  ];

  const updateonequery = `UPDATE public.product_categories SET category='${req.body.category}', isactive='${req.body.isactive}', 
    modified_date='${moment(new Date())}', modifier_userid='${req.body.userId}', usermachinename='${userMachineName}', 
    usermachineip='${userMachineIP}' WHERE id = '${catID}' returning *`;


  try {
    //update is done here
    const row_count = await pool.query(updateonequery)

    if (row_count.rowCount > 0) {

      //res.status(201).json({ 'message': 'success' });
    
      productsRes= respBody.ResponseBody('success',row_count.rows,row_count.rowCount + ' record(s) found');
      resp.json(201, productsRes);
    } else {
     productsRes= respBody.ResponseBody('failed',row_count.rows,row_count.rowCount + ' record(s) found');
     resp.json(404, productsRes);
    }


  } catch (error) {

    productsRes= respBody.ResponseBody('success','','failed with error: ' + helper.parseError(error,updateonequery));
    resp.json(404, productsRes);
  }

}

//GET Products

async function getProducts(req, res, error) {
  var resp = new Response.Response(res);
  var getAllProductsRes = {};
  const pool = await db.dbConnection()

  try {

    pool.query('select * from products', function (err, recordset) {

      if (recordset.rowCount > 0) {
     
       getAllProductsRes= respBody.ResponseBody('success',recordset.rows,recordset.rows.length + ' record(s) found');
        resp.json(200, getAllProductsRes);

      } else {
   
        getAllProductsRes= respBody.ResponseBody('success',recordset.rows,recordset.length + ' record(s) found');
        resp.json(404, getAllProductsRes);
      }
    });

  } catch (error) {

    getAllProductsRes= respBody.ResponseBody('failed',recordset.rows,'failed with error: '+ helper.parseError(error, queryString) );
    resp.json(404, getAllProductsRes);
  }

}


//GET Products BY ID

async function getProductByID(req, res, error) {

  var resp = new Response.Response(res);
  var productID = req.query.productid;
  const pool = await db.dbConnection()

  try {

    var recordset = await pool.query(`select * FROM products WHERE id='${productID}'`)

    if (recordset.rowCount > 0) {
      // send records as a response
      //return res.status(200).json(recordset.rows)

      productsRes =respBody.ResponseBody('success',recordset.rows,'product found with ID: '+ productID);
      resp.json(200, productsRes);

    } else {

      //return res.status(404).json({ 'message': 'failed' })
      productsRes =respBody.ResponseBody('success',recordset.rows,recordset.rows.length + ' record(s) found');
      resp.json(404, productsRes);
    }


  } catch (error) {
    //return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
    productsRes = respBody.ResponseBody('failed',recordset.rows,'failed with error: '+ helper.parseError(error, queryString));
    resp.json(400, productsRes);
  }

}

//CREATE Product

async function createPoduct(req, res) {
  var resp = new Response.Response(res);
  var createProductsRes = {};
  const pool = await db.dbConnection()

  const createQuery = `INSERT INTO public.products(description, extended_description, product_code, cost_price, s_price, category_id, 
      create_userid, create_date, archived, usermachinename, usermachineip)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning description`;

  const values = [
    req.body.description,
    req.body.ext_description,
    req.body.product_code,
    req.body.cost_price,
    req.body.s_price,
    req.body.category_id,
    req.body.userid,
    moment(new Date()),
    req.body.archived,
    userMachineName,
    userMachineIP
  ];

  try {
    const row_count = await pool.query(createQuery, values);

    if (row_count.rowCount > 0) {
      // send records as a response
      //return res.status(201).json({ 'message': 'success' })
      createProductsRes.status = 'success';
        createProductsRes.data = row_count.rows;
        createProductsRes.message = row_count.rowCount + ' record inserted';
        resp.json(201, createProductsRes);

    } else {
      //return res.status(402).json({ 'message': 'failed' });
      createProductsRes.status = 'failed';
        createProductsRes.data = row_count.rows;
        createProductsRes.message = 'create product failed';
        resp.json(404, createProductsRes);
    }

  } catch (error) {
    //return res.status(400).json('record insert failed with error: ' + helper.parseError(error, createQuery));
    createProductsRes.status = 'failed';
    createProductsRes.message = 'record insert failed with error: ' + helper.parseError(error, createQuery);
    resp.json(404, createProductsRes);
  }
}


//update a Product
async function updateProduct(req, res, error) {
  var resp = new Response.Response(res);
  var updateProductsRes = {};
  const id = req.params.id;
  
  const pool = await db.dbConnection();

  const values = [
    req.body.description,
    req.body.ext_description,
    req.body.product_code,
    req.body.cost_price,
    req.body.s_price,
    req.body.category_id,
    req.body.userid,
    moment(new Date()),
    req.body.archived,
    userMachineName,
    userMachineIP
  ];

  const updateonequery = `UPDATE products SET description='${req.body.description}', extended_description='${req.body.ext_description}', 
  product_code='${req.body.product_code}', cost_price='${req.body.cost_price}', s_price='${req.body.s_price}', category_id='${req.body.category_id}', 
  archived='${req.body.archived}', modified_date='${moment(new Date())}', modifier_id='${req.body.userid}', usermachinename='${userMachineName}', 
  usermachineip='${userMachineIP}' WHERE id = '${id}' returning *`;


  try {

    const row_count = await pool.query(updateonequery)

    if (row_count.rowCount > 0) {
      // send records as a response
      //return res.status(201).json({ 'message': 'success' })

     updateProductsRes = respBody.ResponseBody('success',row_count.rows,' record updated succesfully');
     resp.json(201, updateProductsRes);



    } else {
      //return res.status(402).json({ 'message': 'failed' })
      updateProductsRes = respBody.ResponseBody('failed',row_count.rows,'failed to update record');
      resp.json(402, updateProductsRes);
    }

  } catch (error) {
    //return res.status(400).json('record update failed with error: ' + helper.parseError(error, updateonequery))
    updateProductsRes = respBody.ResponseBody('failed',row_count.rows,'update failed with error: '+ helper.parseError(error, updateonequery));
    resp.json(400, updateProductsRes);
  }
}
module.exports = {
  createPoductCategory,
  getProductCategories,
  getProductCategoryID,
  updateProductCategory,
  getProducts,
  getProductByID,
  createPoduct,
  updateProduct
}

