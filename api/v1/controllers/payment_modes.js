var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var dbConfig = require('../../../config');


const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;

//GET PAYMENT MODE
async function getPaymentModes(req, res, error) {

    const queryString = 'select * from public.payment_modes'
    const pool = await db.dbConnection()
  
    try {
  
      pool.query(queryString, function (err, recordset) {
  
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
  
  //GET PAYMENT MODE BY ID
  async function getPaymentModeByID(req, res, error) {
  
    const id = req.params.id
    const queryString = `select * FROM payment_modes WHERE id='${id}'`
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
  
  
  
  //ADD PAYMENT MODE
  async function createPaymentMode(req, res, error) {
  
    const values = [
      req.body.description,
      req.body.isactive,
      moment(new Date()),
      req.body.userid,
      userMachineName,
      userMachineIP
    ];
    const pool = await db.dbConnection()
  
    const createQuery = `INSERT INTO public.payment_modes(description, isactive, create_date, create_user_id, usermachinename, usermachineip)
      VALUES ($1, $2, $3, $4, $5, $6) returning *`;
  
    try {
  
      const row_count = await pool.query(createQuery, values)
  
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
  
  
  //UPDATE PAYMENT MODE
  async function updatePaymentMode(req, res, error) {
  
    const id = req.params.id;
    const pool = await db.dbConnection();
  
    const values = [
      req.body.description,
      req.body.isactive,
      moment(new Date()),
      req.body.userid,
      userMachineName,
      userMachineIP
    ];
  
    const updateonequery = `UPDATE public.payment_modes SET description='${req.body.description}', isactive='${req.body.isactive}', 
    modified_date='${moment(new Date())}', modifier_id='${req.body.userid}', usermachinename='${userMachineName}', usermachineip='${userMachineIP}'
      WHERE id = '${id}' returning *`;
  
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
  
  module.exports={
    getPaymentModes,
    getPaymentModeByID,
    createPaymentMode,
    updatePaymentMode
  }