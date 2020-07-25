var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var dbConfig = require('../../../config');


const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;

//SUPPLIERS

async function getSuppliers(req, res, error) {
    const queryString = 'SELECT * FROM public.suppliers'
    const pool = await db.dbConnection()
  
    try {
  
      const row_count = await pool.query(queryString)
  
      if (row_count > 0) {
  
        return res.status(200).json(recordset.rows)
  
      } else {
  
        return res.status(402).json({ 'message': 'failed' })
      }
  
      //res.status(200).json(recordset.rows);
  
    }
    catch (error) {
  
      return res.status(402).json('record not found with error: ' + helper.parseError(error, queryString))
  
    }
  }
  
  
  async function getSupplierByID(req, res) {
    const id = req.params.id;
    const pool = await db.dbConnection()
    const query = `SELECT * FROM public.suppliers WHERE supplierid ='${id}'`
  
    try {
  
      pool.query(query, function (err, recordset) {
  
        if (err) {
  
          return res.status(402).json('record not found with error: ' + helper.parseError(err, query))
  
        } else {
          if (recordset.rows.length > 0) {
            // send records as a response
            return res.status(201).json(recordset.rows)
          } else {
            return res.status(404).json({ 'message': 'Not Found' })
          }
  
        }
      });
  
    } catch (error) {
      return res.status(402).json('record not found with error: ' + helper.parseError(err, query))
    }
  
  }
  
  //Create supplier
  
  async function createSupplier(req, res) {
  
    const pool = await db.dbConnection()
  
    const createQuery = `INSERT INTO public.suppliers (name, address, phone_number, email, create_date, user_id, isactive,
      usermachinename, usermachineip) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *`;
  
    const values = [
      req.body.suppliername,
      req.body.address,
      req.body.phonenumber,
      req.body.email,
      moment(new Date()),
      req.body.userid,
      req.body.isactive,
      userMachineName,
      userMachineIP
    ];
  
    try {
  
      pool.query(createQuery, values, function (err, recordset) {
  
        if (err) {
  
          return res.status(400).json('record insert failed with error: ' + helper.parseError(err, createQuery))
  
        } else {
          if (recordset.rows.length > 0) {
            // send records as a response
            return res.status(201).json({ 'message': 'success' })
          } else {
            return res.status(404).json({ 'message': 'failed' })
          }
  
        }
      });
  
    } catch (error) {
      return res.status(400).json('record insert failed with error: ' + helper.parseError(err, createQuery))
    }
  }
  
  
  //update supplier
  
  async function updateSupplier(req, res, error) {
  
    const id = req.params.id;
    const pool = await db.dbConnection();
  
    const values = [
      req.body.suppliername,
      req.body.address,
      req.body.phonenumber,
      req.body.email,
      moment(new Date()),
      req.body.userid,
      req.body.isactive,
      userMachineName,
      userMachineIP
    ];
  
  
    const updateonequery = `UPDATE public.suppliers SET name='${req.body.suppliername}', address='${req.body.address}', 
      phone_number='${req.body.phonenumber}', email='${req.body.email}', isactive='${req.body.isactive}', 
      modified_date='${moment(new Date())}', m_user_id='${req.body.userid}', userMachineName='${userMachineName}',
      usermachineip='${userMachineIP}' WHERE supplierid = '${id}' returning *`;
  
    try {
  
      const row_count = await pool.query(updateonequery)
  
      console.log('update', row_count.rowCount)
      if (row_count.rowCount > 0) {
  
        return res.status(201).json({ 'message': 'success' })
  
      } else {
  
        return res.status(404).json({ 'message': 'failed' })
      }
    }
    catch (error) {
      return res.status(400).json('record update failed with error: ' + helper.parseError(error, updateonequery))
  
    }
  }
module.exports={
    getSuppliers,
    getSupplierByID,
    createSupplier,
    updateSupplier
}  