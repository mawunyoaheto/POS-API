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
var transResp={};


//GET modules 
async function getModules(req, res, error) {
  var resp = new Response.Response(res);

    const queryString = `select * from public.modules WHERE isactive = 'true'`
    const pool = await db.dbConnection()
  
    try {
  
      const recordset = await pool.query(queryString)
  
      if (recordset.rowCount > 0) {
        // send records as a response
        transResp = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
           resp.json(201, transResp);
  
      } else {
        transResp = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
        resp.json(404, transResp);
      }
  
    } catch (error) {
      transResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(404, transResp);
    }
  
  }
  
  
  //GET module by ID
  async function getModuleByID(req, res, error) {
    var resp = new Response.Response(res);
    const moduleID = req.query.id;
    const pool = await db.dbConnection()
  
  
    const queryString = `select * FROM public.modules WHERE id='${moduleID}' and isactive = 'true'`
  
    try {
  
      pool.query(queryString, function (error, recordset) {
  
        if (recordset.rowCount > 0) {
          // send records as a response
          transResp = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
           resp.json(201, transResp);
        } else {
          transResp = respBody.ResponseBody('success', recordset.rows, recordset.rowCount + ' record(s) found');
        resp.json(404, transResp);
        }
      });
  
    } catch (error) {
      transResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(404, transResp);
  
    }
  }
  
  
  //GET module transaction by module ID
  async function getModuleTransactionsByModuleID(req, res, error) {
    var resp = new Response.Response(res);
    const moduleID = req.query.id;
    const pool = await db.dbConnection()
  
  
    const queryString = `select id, description FROM public.moduletransactions WHERE moduleid='${moduleID}' and isactive = 'true'`
  
    try {
  
      const modTrans = await pool.query(queryString)
  
      if (modTrans.rowCount > 0) {
  
        var transactionstages = []
        var stages ={}
  
        for (var i = 0; i < modTrans.rowCount; i++) {
  
          var modTransID = modTrans.rows[i].id
          var modTransDesc = modTrans.rows[i].description
  
          stages = await getModuleTransStages(modTransID)
  
          var transaction ={
            id: modTransID,
            description: modTransDesc,
            stages: stages
          }
          
          transactionstages.push(transaction)
         
        }
        transResp = respBody.ResponseBody('success', transactionstages, modTrans.rowCount + ' record(s) found');
           resp.json(201, transResp);
  
      } else {
  
        transResp = respBody.ResponseBody('success', '', modTrans.rowCount + ' record(s) found');
           resp.json(201, transResp);
      }
  
  
    } catch (error) {
      transResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(404, transResp);
  
    }
  }
  
  
  //GET module transaction Stages by module Trans ID
  async function getTransactionStagesByModuleTransID(req, res, error) {
  
    var moduleTrans = {}
    const moduleTransID = req.params.id;
    const pool = await db.dbConnection()
  
  
    const queryString = `select * FROM public.transactionstages WHERE moduleid='${moduleTransID}'`
  
    try {
  
      pool.query(queryString, function (err, recordset) {

        if (recordset.rowCount > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
        } else {
          return res.status(404).json('record not found')
        }
      });
  
    } catch (error) {
      transResp = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
      resp.json(404, transResp);
  
    }
  }
  
  
  //Function to return transaction stages by nodtransid
  async function getModuleTransStages(modtransID) {
  
    const queryString = `select id, description, code, url, iconid, module_transaction_id from public.transactionstages WHERE module_transaction_id='${modtransID}' and isactive ='true'`
  
    const pool = await db.dbConnection()
  
    try {
  
      const recordset = await pool.query(queryString)
  
      if (recordset.rowCount > 0) {
        // send records as a response
        return recordset.rows
  
      } 
  
    } catch (error) {
      return helper.parseError(error, queryString)
    }
  
  }

  module.exports={
    getModuleTransactionsByModuleID,
    getModules,
    getModuleByID,
    getTransactionStagesByModuleTransID
  }