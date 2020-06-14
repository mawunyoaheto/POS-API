var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var dbConfig = require('../config');

const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;


//GET ALL PRODUCT CATEGORIES
async function getProductCategories(req, res, error) {

  const pool = await db.dbConnection()

  try {

    pool.query('select * from product_categories', function (err, recordset) {

      if (recordset.rowCount > 0) {
        // send records as a response
        return res.status(200).json(recordset.rows)

      } else {
        return res.status(404).json({ 'message': 'failed with no records found' })
      }
    });

  } catch (error) {
    return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
  }

}


//GET PRODUCT CATEGORY BY ID
async function getProductCategoryID(catID, res, error) {

  const pool = await db.dbConnection()

  try {

    const recordset = await pool.query(`select * FROM product_categories WHERE id='${catID}'`)

    if (recordset.rowCount > 0) {
      // send records as a response
      return res.status(200).json(recordset.rows)

    } else {
      return res.status(404).json({ 'message': 'failed' })
    }


  } catch (error) {
    return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
  }

}



//CREATE PRODUCT CATEGORY
async function createPoductCategory(req, res, error) {

  const pool = await db.dbConnection()

  const createQuery = `INSERT INTO public.product_categories(category, isactive, create_userid, create_date, usermachinename, usermachineip) 
    VALUES ( $1, $2, $3, $4, $5, $6); returning *`;

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
      return res.status(201).json({ 'message': 'success' })

    } else {
      return res.status(402).json({ 'message': 'failed' })
    }

  } catch (error) {
    return res.status(400).json('record insert failed with error: ' + helper.parseError(error, createQuery))
  }
}



//UPDATE PRODUCT CATEGORY
async function updateProductCategory(req, res, error) {

  const id = req.params.id;
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
    usermachineip='${userMachineIP}' WHERE id = '${id}' returning *`;

  const confirmed = await helper.confirmRecord(findonequery, id);

  try {
    //update is done here
    const row_count = await pool.query(updateonequery)

    if (row_count.rowCount > 0) {

      res.status(201).json({ 'message': 'success' });
    } else {
      res.status(402).json({ 'message': 'updated' });
    }


  } catch (error) {

    return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
  }

}

//GET Products

async function getProducts(req, res, error) {

  const pool = await db.dbConnection()

  try {

    pool.query('select * from products', function (err, recordset) {

      if (recordset.rowCount > 0) {
        // send records as a response
        return res.status(200).json(recordset.rows)

      } else {
        return res.status(404).json({ 'message': 'No Record Found' })
      }
    });

  } catch (error) {
    return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
  }

}


//GET Products BY ID

async function getProductByID(catID, res, error) {

  const pool = await db.dbConnection()

  try {

    const recordset = await pool.query(`select * FROM products WHERE id='${catID}'`)

    if (recordset.rowCount > 0) {
      // send records as a response
      return res.status(200).json(recordset.rows)

    } else {
      return res.status(404).json({ 'message': 'failed' })
    }


  } catch (error) {
    return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
  }

}

//CREATE Product

async function createPoduct(req, res) {

  const pool = await db.dbConnection()

  const createQuery = `INSERT INTO public.products(description, extended_description, product_code, cost_price, s_price, category_id, 
      create_userid, create_date, archived, usermachinename, usermachineip)
      VALUES ($1, $2, $, $4, $5, $6, $7, $8, $9, $10, $11) returning *`;

  const values = [
    req.body.description,
    req.body.ext_description,
    req.body.product_code,
    req.body.cost_price,
    req.body.s_price,
    req.body.category_id,
    req.body.create_user_id,
    moment(new Date()),
    req.body.archived,
    userMachineName,
    userMachineIP
  ];

  try {
    const row_count = await pool.query(createQuery, values);

    if (row_count.rowCount > 0) {
      // send records as a response
      return res.status(201).json({ 'message': 'success' })

    } else {
      return res.status(402).json({ 'message': 'failed' })
    }

  } catch (error) {
    return res.status(400).json('record insert failed with error: ' + helper.parseError(error, createQuery))
  }
}


//update a Product
async function updateProduct(req, res, error) {

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
      return res.status(201).json({ 'message': 'success' })

    } else {
      return res.status(402).json({ 'message': 'failed' })
    }

  } catch (error) {
    return res.status(400).json('record update failed with error: ' + helper.parseError(error, updateonequery))

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

