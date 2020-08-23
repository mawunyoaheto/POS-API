var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var dbConfig = require('../../../config');
const Response = require('../util/response');
const respBody = require('../util/response');


const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;
var paymodeRes={};

//GET PAYMENT MODE
async function getPaymentModes(req, res, error) {
  var resp = new Response.Response(res);
    const queryString = 'select * from public.payment_modes'
    const pool = await db.dbConnection()
  
    try {
  
      pool.query(queryString, function (err, recordset) {
  
        if (recordset.rowCount > 0) {
          // send records as a response
          paymodeRes = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
           resp.json(201, paymodeRes);
  
        } else {
          paymodeRes = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
          resp.json(402, paymodeRes);
        }
      });
  
    } catch (error) {
      paymodeRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(500, paymodeRes);
    }
  }
  
  //GET PAYMENT MODE BY ID
  async function getPaymentModeByID(req, res, error) {
    var resp = new Response.Response(res);
    const id = req.query.id
    const queryString = `select * FROM payment_modes WHERE id='${id}'`
    const pool = await db.dbConnection()
  
    try {
  
      pool.query(queryString, function (err, recordset) {
  
        if (recordset.rowCount > 0) {
          // send records as a response
          paymodeRes = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
           resp.json(201, paymodeRes);
  
        } else {
          paymodeRes = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
          resp.json(402, paymodeRes);
        }
      });
  
    } catch (error) {
      paymodeRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(500, paymodeRes);
    }
  
  }
  
  
  
  //ADD PAYMENT MODE
  async function createPaymentMode(req, res, error) {
    var resp = new Response.Response(res);
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
        paymodeRes = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
        resp.json(201, paymodeRes);
  
      } else {
        paymodeRes = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
        resp.json(402, paymodeRes);
      }
  
    } catch (error) {
      paymodeRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(500, paymodeRes);
    }
  }
  
  
  //UPDATE PAYMENT MODE
  async function updatePaymentMode(req, res, error) {
    var resp = new Response.Response(res);
    const id = req.query.id;
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
  
      const recordset = await pool.query(updateonequery)
  
      if (recordset.rowCount > 0) {
        // send records as a response
        paymodeRes = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
        resp.json(201, paymodeRes);
  
      } else {
        paymodeRes = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
        resp.json(402, paymodeRes);
      }
  
    } catch (error) {
      paymodeRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(500, paymodeRes);
  
    }
  
  }
  
  module.exports={
    getPaymentModes,
    getPaymentModeByID,
    createPaymentMode,
    updatePaymentMode
  }