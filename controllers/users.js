var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var dbConfig = require('../config');


const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;




async function createUser(req, res, next) {

  const pool = await db.dbConnection()

  if (!req.body.fname) {
    res.status(400).send({ 'message': 'First Name missing' });
  }

  if (!req.body.lname) {
    res.status(400).send({ 'message': 'Last Name missing' });
  }

  if (!req.body.uname || !req.body.password) {
    res.status(400).send({ 'message': 'Some values are missing' });
  }

  if (!helper.Helper.isValidEmail(req.body.email)) {
    res.status(400).send({ 'message': 'Please enter a valid email address' });
  }

  const hashPassword = helper.Helper.hashPassword(req.body.password);

  const createQuery = `INSERT INTO public.users(first_name, last_name, username, email, password, user_role_id, phone_number, blocked, 
    create_date, create_userid, usermachinename, usermachineip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *`;

    const userOutletsQuery = `INSERT INTO public.user_outlets(userid, outletid) VALUES ($1, $2);`


  const values = [
    req.body.fname,
    req.body.lname,
    req.body.uname,
    req.body.email,
    hashPassword,
    req.body.user_role,
    req.body.cellphone,
    req.body.blocked,
    moment(new Date()),
    req.body.create_userid,
    userMachineName,
    userMachineIP
  ];


  try {

    //await pool.query('BEGIN')

    const records = await pool.query(createQuery, values)

    userID = records.rows[0].id

    for (var i = 0; i < req.body.useroutlets.length; i++) {

      var userOutletValues=[
        userID,
        req.body.useroutlets[i].id      
      ];

     await pool.query(userOutletsQuery,userOutletValues)

    }

    await pool.query('COMMIT')
      //const token = helper.Helper.generateToken(records[0].id);
      //console.log('token', token)
      res.status(201).json({ 'message': 'Success' });

  } catch (error) {

    pool.query('ROLLBACK')

    if (error.routine === '_bt_check_unique') {
      res.status(400).send({ 'message': 'User with that EMAIL already exist' })
    }
    return res.status(400).json('record update failed with error: ' + helper.parseError(error, createQuery))
  }

}

//GET User by ID

async function getUserByID(req, res, error) {

  const pool = await db.dbConnection()

  var userDetails = {}
  const userId = req.params.id;

  const getUserQuery = `SELECT * FROM users WHERE id = '${userId}'`;

  try {
    const  recordset= await pool.query(getUserQuery)
    
    if (recordset.rowCount > 0 ) {
      userDetails.details = recordset.rows[0]
      userDetails.details.outlets = await getUserOutletsByUserID(userId)

      return res.status(200).json(userDetails)
    }else{

      return res.status(404).json({ 'message': 'failed' })
    }
  } catch (error) {
    return res.status(400).json('record not found with error: ' + helper.parseError(error, getUserQuery))
  }
}


async function getAllUsers(req, res) {

  const pool = await db.dbConnection()

  const getUserQuery = `SELECT * FROM users WHERE Archived = 'false'`;

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

//UPDATE User 
async function updateUser(req, res, next){

  const pool = await db.dbConnection()

  if (!req.body.fname) {
    res.status(400).send({ 'message': 'First Name missing' });
  }

  if (!req.body.lname) {
    res.status(400).send({ 'message': 'Last Name missing' });
  }

  if (!req.body.uname) {
    res.status(400).send({ 'message': 'Some values are missing' });
  }

  if (!helper.Helper.isValidEmail(req.body.email)) {
    res.status(400).send({ 'message': 'Please enter a valid email address' });
  }

  const id = req.params.id
  
  const values = [
    req.body.fname,
    req.body.lname,
    req.body.uname,
    req.body.email,
    req.body.user_role,
    req.body.cellphone,
    req.body.blocked,
    req.body.archived,
    moment(new Date()),
    req.body.userid,
    userMachineName,
    userMachineIP
  ];

  const updateQuery = `UPDATE public.users SET first_name='${req.body.fname}', last_name='${req.body.lname}', username='${req.body.uname}',
  email='${req.body.email}', user_role_id='${req.body.user_role}', phone_number='${req.body.cellphone}',blocked='${req.body.blocked}', 
  archived='${req.body.archived}', modifier_userid='${req.body.userid}', modified_date='${moment(new Date())}', usermachinename='${userMachineName}',
   usermachineip='${userMachineIP}' WHERE id ='${id}' returning *`;

    const userOutletsQuery = `INSERT INTO public.user_outlets(userid, outletid) VALUES ($1, $2);`

    const deleteUserOutlets = `DELETE FROM public.user_outlets WHERE userid = '${id}'`


  try {

    await pool.query('BEGIN')

    await pool.query(deleteUserOutlets)
    await pool.query(updateQuery)

    for (var i = 0; i < req.body.useroutlets.length; i++) {

      var userOutletValues=[
        id,
        req.body.useroutlets[i].id      
      ];

     await pool.query(userOutletsQuery,userOutletValues)

    }

    await pool.query('COMMIT')
    
      res.status(201).json({ 'message': 'Success' });

  } catch (error) {

    pool.query('ROLLBACK')
    return res.status(400).json('record update failed with error: ' + helper.parseError(error, updateQuery))
  }


}

//DELETE USER

async function deleteUser(req, res) {
  try {

    const id = req.params.id;
    const pool = await db.dbConnection()

    const findonequery = 'SELECT * FROM users WHERE id = ($1)';
    const deleteQuery = `UPDATE users SET Archived ='Yes' WHERE id='${id}' returning *`;

    const confirmed = await helper.confirmRecord(findonequery, id);

    if (confirmed) {

      try {

        await pool.query(deleteQuery, function (err, res, next) {
        });

        res.status(201).json({ 'message': 'User deleted succesfully' });

      } catch (error) {
        res.status(404).send({ 'error': err });
      }

    } else {
      res.status(404).send({ 'error': 'user with id:' + id + ' not found' });
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


//GET User Categories

async function getUserCategories(req, res, error) {

  const pool = await db.dbConnection()

  try {

    pool.query('select * from user_categories', function (err, recordset) {

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


//GET User Category BY ID

async function getUserCategoryID(req, res, error) {

  const id = req.params.id
  const queryString = `select * FROM user_categories WHERE id='${id}'`
  const pool = await db.dbConnection()

  try {

    pool.query(queryString, function (err, recordset) {

        if (recordset.rowCount > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)

        } else {
          return res.status(404).json({ 'message': 'failed' })
        }
    });

  } catch (error) {
    return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
  }

}

//ADD User Category
async function createUserCategory(req, res, error) {

  
  const pool = await db.dbConnection()

  const createQuery = `INSERT INTO public.user_categories(category, isactive, create_userid, create_date, usermachinename, usermachineip)
    VALUES ($1, $2, $3, $4, $5, $6) returning *`;

    const values = [
      req.body.category,
      req.body.isactive,
      req.body.createuser_id,
      moment(new Date()),
      userMachineName,
      userMachineIP
    ];

  try {

    const row_count = await pool.query(createQuery,values) 

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


//UPDATE User Category

async function updateUserCategory(req, res,error) {

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

  const updateonequery = `UPDATE public.user_categories SET category='${req.body.category}', isactive='${req.body.isactive}', 
  create_userid='${req.body.userId}',  modifier_userid='${req.body.userId}', modified_date='${moment(new Date())}', 
  usermachinename='${userMachineName}', usermachineip='${userMachineIP}' WHERE id = '${id}' returning *`;

  try {

    const row_count= await pool.query(updateonequery)

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


//GET User Outlets

  async function getUserOutletsByUserID(userId) {

    const queryString = `select outletid  AS id FROM user_outlets WHERE userid='${userId}'`
    const pool = await db.dbConnection()
  
    try {
  
     const recordset = await  pool.query(queryString) 
  
          if (recordset.rowCount > 0) {
            // send records as a response
            return recordset.rows
  
          } else {
            return res.status(404).json({ 'message': 'failed' })
          }
  
    } catch (error) {
      return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
    }
  
  }


  async function updateUserOutletsByUserID(req, res,error) {

    const id = req.params.id;
    const pool = await db.dbConnection();
  
    const deleteUserOutlets = `delete from public.user_outlets WHERE userid='${id}'`
    const userOutletsQuery = `INSERT INTO public.user_outlets(userid, outletid) VALUES ($1, $2);`
  
    try {

      await pool.query('BEGIN')
  
      const records = await pool.query(deleteUserOutlets)
  
      for (var i = 0; i < req.body.useroutlets.length; i++) {
  
        console.log('useroutlets',req.body.useroutlets[i].id)
  
        var userOutletValues=[
          id,
          req.body.useroutlets[i].id      
        ];
  
  
       await pool.query(userOutletsQuery,userOutletValues)
  
      }
  
      await pool.query('COMMIT')
       
        return true
  
    } catch (error) {
  
      pool.query('ROLLBACK')

      return false
    }
  
  }

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


 //GET User Category by ID

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
  getUserRoles,
  getUserOutletsByUserID,
  updateUserOutletsByUserID,
  updateUser
};