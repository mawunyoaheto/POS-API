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
var taxResp={};

//TAXES

//GET TAX
async function getTax(req, res, error) {
  var resp = new Response.Response(res);

    const queryString = 'SELECT * FROM public.taxes'
    const pool = await db.dbConnection()
  
    try {
  
      pool.query(queryString, function (err, recordset) {
  
        if (recordset.rowCount > 0) {
          // send records as a response
           taxResp = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
           resp.json(201, taxResp);
  
        } else { 
          taxResp = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
          resp.json(404, taxResp);
        }
  
      });
  
    } catch (error) {
      taxResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(404, taxResp);
    }
  }
  
  
  //GET TAX BY ID
  async function getTaxByID(req, res, error) {

    var resp = new Response.Response(res);
    const id = req.query.id;
    const queryString = `SELECT * FROM public.taxes WHERE taxid ='${id}'`
    const pool = await db.dbConnection()
  
    try {
  
      const row_count = await pool.query(queryString)
  
      if (row_count.rowCount > 0) {
  
        taxResp = respBody.ResponseBody('success', row_count.rows, row_count.rowCount + ' record(s) found');
           resp.json(201, taxResp);
  
      } else {
        taxResp = respBody.ResponseBody('success', row_count.rows, row_count.rowCount + ' record(s) found');
          taxResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      };
  
    }
  
    catch (error) {
      taxResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(404, taxResp);
    }
  
  }
  
  
  ///ADD TAX
  async function createTax(req, res, error) {
    var resp = new Response.Response(res);
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
  
          taxResp = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) added');
          resp.json(201, taxResp);
        } else {
          taxResp = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) added');
          resp.json(404, taxResp);
        }
  
      });
  
    } catch (error) {
      taxResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(404, taxResp);
    }
  }
  
  //Update Tax
  
  async function updateTax(req, res, error) {
    var resp = new Response.Response(res);
    const id = req.query.id;
    const pool = await db.dbConnection();
  
    const values = [
      req.body.taxdescription,
      req.body.percentage,
      moment(new Date()),
      req.body.userid,
      req.body.isactive,
      userMachineName,
      userMachineIP
    ];
  
    const updateonequery = `UPDATE public.taxes SET description='${req.body.taxdescription}', percentage='${req.body.percentage}', 
      modified_date='${moment(new Date())}', modifier_userid='${req.body.userid}', isactive='${req.body.isactive}',
      usermachinename='${userMachineName}', usermachineip='${userMachineIP}'  WHERE taxid = '${id}' returning *`;
  
    try {
  
      const row_count = await pool.query(updateonequery)
  
  
      if (row_count.rowCount > 0) {
        // send records as a response
        taxResp = respBody.ResponseBody('success', row_count.rows, row_count.rowCount + ' record updated');
           resp.json(201, taxResp);
      } else {
        return res.status(402).json({ 'message': 'failed' })
      }
  
    } catch (error) {
      taxResp = respBody.ResponseBody('success', row_count.rows, row_count.rowCount + ' record(s) updated');
          taxResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
    }
  
  }
module.exports={
    getTax,
    getTaxByID,
    createTax,
    updateTax
}  