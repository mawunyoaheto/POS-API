var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var dbConfig = require('../../../config');
const Response = require('../util/response');
const respBody = require('../util/response');

var taxResp={};

//TAXES

//GET TAX
async function getTax(req, res, error) {
    const queryString = 'SELECT * FROM public.taxes'
    const pool = await db.dbConnection()
  
    try {
  
      pool.query(queryString, function (err, recordset) {
  
        if (recordset.rowCount > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
  
        } else {
          return res.status(404).json({ 'message': 'No Records Found' })
        }
  
      });
  
    } catch (error) {
      return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
    }
  }
  
  
  //GET TAX BY ID
  async function getTaxByID(req, res, error) {
    const id = req.params.id;
    const queryString = `SELECT * FROM public.taxes WHERE taxid ='${id}'`
    const pool = await db.dbConnection()
  
    try {
  
      const row_count = await pool.query(queryString)
  
      if (row_count.rowCount > 0) {
  
        return res.status(200).json(recordset.rows)
  
      } else {
        return res.status(404).json({ 'message': 'Rcord Not Found' })
      }
  
    }
  
    catch (error) {
      return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
    }
  
  }
  
  
  ///ADD TAX
  async function createTax(req, res, error) {
  
    const values = [
      req.body.taxdescription,
      req.body.percentage,
      moment(new Date()),
      req.body.userid,
      req.body.isactive,
      userMachineName,
      userMachineIP
    ];
  
    const pool = await db.dbConnection()
  
    const createQuery = `INSERT INTO public.taxes(description, percentage, create_date, isactive, create_userid, 
      usermachinename, usermachineip) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *`;
  
  
    try {
  
      await pool.query(createQuery, values, function (err, recordset) {
  
  
        if (recordset.rowCount > 0) {
  
          return res.status(201).json({ 'message': 'success' })
  
        } else {
          return res.status(402).json({ 'message': 'failed' })
        }
  
      });
  
    } catch (error) {
      return res.status(400).json('record insert failed with error: ' + helper.parseError(error, createQuery))
    }
  }
  
  //Update Tax
  
  async function updateTax(req, res, error) {
  
    const id = req.params.id;
    const pool = await db.dbConnection();
  
    const values = [
      req.body.description,
      req.body.percentage,
      moment(new Date()),
      req.body.userid,
      req.body.isactive,
      userMachineName,
      userMachineIP
    ];
  
    const updateonequery = `UPDATE public.taxes SET description='${req.body.description}', percentage='${req.body.percentage}', 
      modified_date='${moment(new Date())}', modifier_userid='${req.body.userid}', isactive='${req.body.isactive}',
      usermachinename='${userMachineName}', usermachineip='${userMachineIP}'  WHERE taxid = '${id}' returning *`;
  
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
    getTax,
    getTaxByID,
    createTax,
    updateTax
}  