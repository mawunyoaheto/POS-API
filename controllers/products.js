var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');




/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Products management
 */


/**
 * @swagger
 * /product-category:
 *  get:
 *    summary: Get all product categories
 *    tags: [Products]
 *    description: Used to get all product categories
 *    responses:
 *      '200':
 *        description: A succesful response
 */
  
async function getProductCategories(req, res) {
  
  const pool = await db.dbConnection()

  try {

    pool.query('select * from product_categories', function (err, recordset) {

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
 *  /product-category/catID:
 *    get:
 *      summary: Get a product category by id
 *      tags: [Products]
 *      parameters:
 *          name: catID
 *          -in: path
 *          description: id of product category to fetch
 *          schema:
 *            type: string
 *          required: true
 *      responses:
 *        '200':
 *          description: A succesful response
 *          content:
 *            application/json:
 */

async function getProductCategoryID(catID, res) {

  const pool = await db.dbConnection()

  try {

    const recordset = await pool.query(`select * FROM product_categories WHERE id='${catID}'`)

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
 * /product-category:
 *  post:
 *    summary: Add a new product category
 *    tags: [Products]
 *    description: Used to create a product category
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function createPoductCategory(req, res,err) {

    const pool = await db.dbConnection()
  
    const createQuery = `INSERT INTO product_categories(category, create_date) VALUES($1, $2) returning *`;

    const createCategoryLineQuery = `INSERT INTO public.product_categories_lines (categoryid, description, qty)
          VALUES ($1, $2, $3) returning *`;

    const values = [
      req.body[0].category,
      moment(new Date())
    ];
  
      try {
        console.log('inside-inner try','I am here')
        await pool.query('BEGIN')

        try {

          console.log('inside-inner try','I am here')
          const { rows } = await pool.query(createQuery, values);
          
          
          var catID=rows[0].id
          console.log('Return-ID',catID)

          for(var i=0; i<req.body.length; i++) {
   
            var orderLinesvalues = [
                catID,
                req.body[i].description,
                req.body[i].qty
            ];  

            //console.log(i,req.body[i].description + '' +req.body[i].qty)
            
            var { rowslines } = await pool.query(createCategoryLineQuery, orderLinesvalues);
        }
    
          console.log('out-of-loop','Success')
          pool.query('COMMIT')
          return res.status(201).send({ 'message': 'created succesfully' });
 
        } catch (error) {
          console.log(error)
          console.log('inside-inner-catch','I am here')
          pool.query('ROLLBACK')

          res.status(400).send(error);
        }
  
    } catch (error) {
      console.log('inside-outer-catch','I am here')
      res.status(400).send(error);
      console.log(error)
      pool.query('ROLLBACK')
    }
  
  }


/**
 * @swagger
 * /product-category:
 *  put:
 *    summary: update a product category by ID
 *    tags: [Products]
 *    description: Used to update a product category
 *    responses:
 *      '200':
 *        description: A succesful response
 */

  async function updateProductCategory(req, res) {

    const id = req.params.id;
    const pool = await db.dbConnection();
  
    const values = [
      req.body.category,
      id
    ];
    const findonequery = 'SELECT * FROM product_categories WHERE id = ($1)';
    const updateonequery = `UPDATE product_categories SET category = '${req.body.category}', modified_date='${moment(new Date())}' WHERE id = '${id}' returning *`;
  
   //const confirmed = await confirmRecord(findonequery, id);
    const confirmed = await helper.confirmRecord(findonequery, id);
    if (confirmed) {
  
      try {
        //update is done here
        await pool.query(updateonequery, (err, res, next) =>{
  
          console.log(res.rows)
         
        });
        
  res.status(201).json({ 'message': 'Product Category updated succesfully' });
      } catch (error) {
        console.log('UPDATE-ERROR',error)
        res.status(404).json({ 'error': error });
      }
  
      //res.status(200).json({ 'message': 'record found' })
  
    } else {
  
      res.status(404).json({ 'message': 'Update failed: record does not exist' });
    }
  
  };
  

  //GET Products

  
  /**
   * get all Products
   * @param {object} req 
   * @param {object} res
   * @returns {object} user category object 
   */
  
  
  async function getProducts(req, res) {
  
    const pool = await db.dbConnection()
  
    try {
  
      pool.query('select * from products', function (err, recordset) {
  
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


  //GET Products BY ID

  /**
 * get Product by ID
 * @param {object} req 
 * @param {object} res
 * @returns {object} user category object 
 */


async function getProductByID(catID, res) {

  const pool = await db.dbConnection()

  try {

    const recordset = await pool.query(`select * FROM products WHERE id='${catID}'`)

    if (recordset.rowsAffected > 0) {
      return recordset.recordset[0].category
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

  //CREATE Product

  async function createPoduct(req, res) {

    const pool = await db.dbConnection()
  
    const createQuery = `INSERT INTO products(
      description, extended_description, product_code, cost_price, s_price, category_id, create_user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
        returning *`;
    const values = [
      req.body.description,
      req.body.ext_description,
      req.body.product_code,
      req.body.cost_price,
      req.body.s_price,
      req.body.category_id,
      req.body.create_user_id
    ];
  
      try {
      const { rows } = await pool.query(createQuery, values);
  
      return res.status(201).send({ 'message': 'Product created succesfully' });
  
    } catch (error) {
  
      res.status(400).send(error);
    }
  }

//update a Product


async function updateProduct(req, res) {

  const id = req.params.id;
  const pool = await db.dbConnection();

  const values = [
    req.body.description,
    req.body.ext_description,
    req.body.product_code,
    req.body.cost_price,
    req.body.s_price,
    req.body.category_id,
    req.body.archived,
    moment(new Date()),
    req.body.modifier_userid,
    id
  ];
  const findonequery = 'SELECT * FROM products WHERE id = ($1)';
  //const updateonequery = `UPDATE products SET category = '${req.body.category}', modified_date='${moment(new Date())}' WHERE id = '${id}' returning *`;
  const updateonequery = `UPDATE products
  SET description='${req.body.description}', extended_description='${req.body.ext_description}', product_code='${req.body.product_code}', 
  cost_price='${req.body.cost_price}', s_price='${req.body.s_price}', category_id='${req.body.category_id}', 
  archived='${req.body.archived}', modified_date='${moment(new Date())}', modifier_id='${req.body.modifier_userid}' WHERE id = '${id}' returning *`;

  const confirmed = await confirmRecord(findonequery, id);
  if (confirmed) {

    try {
      //update is done here
      await pool.query(updateonequery, (err, res, next) =>{

        //console.log(res.rows)
       
      });
      
    res.status(201).json({ 'message': 'Product updated succesfully' });
    } catch (error) {
      console.log('UPDATE-ERROR',error)
      res.status(404).json({ 'error': error });
    }

    //res.status(200).json({ 'message': 'record found' })

  } else {

    res.status(404).json({ 'message': 'Update failed: record does not exist' });
  }

};
  module.exports={
      createPoductCategory,
      getProductCategories,
      getProductCategoryID,
      updateProductCategory,
      getProducts,
      getProductByID,
      createPoduct,
      updateProduct
  }

  