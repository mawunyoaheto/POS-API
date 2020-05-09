var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * path:
 *  /users/:
 *    post:
 *      summary: Create a new user
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 */

async function createUser(req, res) {

  const pool = await db.dbConnection()
  console.log('email', req.body.email)
  if (!req.body.email || !req.body.password) {
    res.status(400).send({ 'message': 'Some values are missing' });
  }

  if (!helper.Helper.isValidEmail(req.body.email)) {
    res.status(400).send({ 'message': 'Please enter a valid email address' });
  }

  const hashPassword = helper.Helper.hashPassword(req.body.password);

  const createQuery = `INSERT INTO users(
    fullname, email, password, user_category_id, phone_number, branch_id, create_userid)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
      returning *`;
  const values = [
    req.body.fullname,
    req.body.email,
    hashPassword,
    req.body.usercategory_id,
    req.body.cellphone,
    req.body.branchid,
    req.body.create_userid,
  ];

  try {
    const { rows } = await pool.query(createQuery, values);

    console.log('user-ID', rows[0].id)
    const token = helper.Helper.generateToken(rows[0].id);
    console.log('token', token)
    res.status(201).send({ 'message': 'User created succesfully with token ID:' + token });
    //return res.status(201).send({ token });


  } catch (error) {

    if (error.routine === '_bt_check_unique') {
      res.status(400).send({ 'message': 'User with that EMAIL already exist' })
    }
    res.status(400).send(error);
  }
}

/**
 * Get A User by ID
 * @param {object} req 
 * @param {object} res 
 * @returns {void} return status code 204 
 */
async function getUserByID(req, res) {

  const pool = await db.dbConnection()

  const getUserQuery = 'SELECT * FROM users WHERE id=$1 returning *';

  try {
    const { rows } = await pool.query(getUserQuery, [req.user.id]);
    if (!rows[0]) {
      res.status(404).send({ 'message': 'user not found' });
    }
    res.status(200).json(recordset.rows);
  } catch (error) {
    res.status(400).send(error);
  }
}

/**
 * Get All Users
 * @param {object} req 
 * @param {object} res 
 * @returns {void} return status code 204 
 */
async function getAllUsers(req, res) {

  const pool = await db.dbConnection()

  const getUserQuery = `SELECT * FROM users WHERE Archived = 'No'`;

  try {
    pool.query(getUserQuery, function (err, recordset) {

      if (err) {

        console.log(err)

      } else {

        // send records as a response
        res.status(200).json(recordset.rows);
      }
    });
  }

  catch (error) {
    res.status(400).send(error);
  }
}

/**
 * Delete A User
 * @param {object} req 
 * @param {object} res 
 * @returns {void} return status code 204 
 */
async function deleteUser(req, res) {
  try{

  const id = req.params.id;
  const pool = await db.dbConnection()

  const findonequery = 'SELECT * FROM users WHERE id = ($1)';
  const deleteQuery = `UPDATE users SET Archived ='Yes' WHERE id='${id}' returning *`;

  const confirmed = await helper.confirmRecord(findonequery, id);

  if (confirmed) {

    try {

      await pool.query(deleteQuery, function(err, res, next){
    } );
    
    res.status(201).json({ 'message': 'User deleted succesfully' });
      
    } catch (error) {
      res.status(404).send({ 'error': err });
    }
    
  } else {
    res.status(404).send({ 'error': 'user with id:'+id + ' not found' });
  }
  
}
  catch (error) {
    
    res.status(400).send(error);
  }
}


async function getUserID(email, res) {

  const pool = await db.dbConnection()

  try {

    const recordset = pool.query(`select id FROM users WHERE email='${email}'`)

    if (recordset.rowsAffected > 0) {
      recordset.recordset[0].id
      console.log('user-id', recordset.recordset[0].id)
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
 * create User Category
 * @param {object} req 
 * @param {object} res
 * @returns {object} user category object 
 */

async function createUserCategory(req, res) {

  const pool = await db.dbConnection()

  const createQuery = `INSERT INTO
      user_categories(category, create_date)
      VALUES($1, $2)
      returning *`;
  const values = [
    req.body.category,
    moment(new Date())
  ];

    try {
    const { rows } = await pool.query(createQuery, values);

    return res.status(201).send({ 'message': 'User Category created succesfully' });

  } catch (error) {

    res.status(400).send(error);
  }
}

/**
 * get User Category by ID
 * @param {object} req 
 * @param {object} res
 * @returns {object} user category object 
 */


async function getUserCategoryID(catID, res) {

  const pool = await db.dbConnection()

  try {

    const recordset = await pool.query(`select * FROM user_categories WHERE id='${catID}'`)

    if (recordset.rowsAffected > 0) {
      return recordset.recordset[0].description
      console.log('userCategory-id', recordset.recordset[0].id)
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
 * get all User Categories
 * @param {object} req 
 * @param {object} res
 * @returns {object} user category object 
 */


async function getUserCategories(req, res) {

  const pool = await db.dbConnection()

  try {

    pool.query('select * from user_categories', function (err, recordset) {

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

async function updateUserCategory(req, res) {

  const id = req.params.id;
  const pool = await db.dbConnection();

  const values = [
    req.body.description,
    id
  ];
  const findonequery = 'SELECT * FROM user_categories WHERE id = ($1)';
  const updateonequery = `UPDATE user_categories SET category = '${req.body.description}' WHERE id = '${id}' returning *`;

  const confirmed = await helper.confirmRecord(findonequery, id);
  if (confirmed) {

    try {
      //update is done here
      await pool.query(updateonequery, (err, res, next) =>{

        console.log(res.rows)
       
      });
      
res.status(201).json({ 'message': 'User Category updated succesfully' });
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
 * Login
 * @param {object} req 
 * @param {object} res
 * @returns {object} user object 
 */
async function login(req, res) {

  const pool = await db.dbConnection()

  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ 'message': 'Some values are missing' });
  }
  if (!helper.Helper.isValidEmail(req.body.email)) {
    return res.status(400).send({ 'message': 'Please enter a valid email address' });
  }
  const text = 'SELECT * FROM users WHERE email = $1';
  try {
    const { rows } = await pool.query(text, [req.body.email]);
    if (!rows[0]) {
      return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
    }
    if (!helper.Helper.comparePassword(rows[0].password, req.body.password)) {
      return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
    }
    const token = helper.Helper.generateToken(rows[0].id);
    return res.status(200).send({ token });
  } catch (error) {
    return res.status(400).send(error)
  }


}

/**
 * get User Category by ID
 * @param {object} req 
 * @param {object} res
 * @returns {object} user category object 
 */


async function getUserRolesByID(typeID, res) {

  const pool = await db.dbConnection()

  try {

    const recordset = await pool.query(`select * FROM user_roles WHERE id='${typeID}'`)

    if (recordset.rowsAffected > 0) {
      return recordset.recordset[0].description
      console.log('userCategory-id', recordset.recordset[0].id)
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
 * path:
 *  /users/:
 *    get:
 *      summary: Get user types
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 */


async function getUserRoles(req, res) {

  const pool = await db.dbConnection()

  try {

    pool.query('select * from user_roles', function (err, recordset) {

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

module.exports = {
  createUser,
  getAllUsers,
  login,
  deleteUser,
  getUserID,
  getUserByID,
  createUserCategory,
  getUserCategoryID,
  getUserCategories,
  updateUserCategory,
  getUserRolesByID,
  getUserRoles
};