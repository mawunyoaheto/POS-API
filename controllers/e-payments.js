var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var dbConfig = require('../config');


const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;



async function getEpaymentPayloadTypes(req, res) {

    const queryString = 'SELECT * FROM public.epaymentloadtypes'
    const pool = await db.dbConnection()
  
    try {
  
      pool.query(queryString, function (err, recordset) {
  
        if (err) {
  
          return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))
  
        } else {
          if (recordset.rows.length > 0) {
            // send records as a response
            return res.status(200).json(recordset.rows)
          } else {
            return res.status(402).json('record not found')
          }
  
        }
      });
  
    } catch (error) {
      console.log(error);
      res.end()
  
    }
  
  }
  
  
  
  async function createEpaymentAPI(req, res) {
  
    const pool = await db.dbConnection()
  
    const createQuery = `INSERT INTO public.epaymentapisetup(description, reaquesturl, statusurl, payloadtypeid, apikey, secretkey, 
      userid, code, requestbody, statusbody, active, usermachinename, usermachineip, createuserid)VALUES ($1, $2, $3, $4, $5, $6, $7, 
      $8, $9, $10, $11, $12, $13, $14) returning *`;
  
    const values = [
      req.body.description,
      req.body.requesturl,
      req.body.statusurl,
      req.body.payloadtypeid,
      req.body.apikey,
      req.body.secretkey,
      req.body.userid,
      req.body.code,
      req.body.requestbody,
      req.body.statusbody,
      req.body.isactive,
      userMachineName,
      userMachineIP,
      req.body.userid,
  
    ];
  
    try {
  
      pool.query(createQuery, function (err, recordset) {
  
        if (err) {
  
          return res.status(402).json('record not created with error: ' + helper.parseError(err, queryString))
  
        } else {
          if (recordset.rows.length > 0) {
            // send records as a response
            return res.status(201).json({ 'message': 'success' })
          } else {
            return res.status(402).json({ 'message': 'failed' })
          }
  
        }
      });
  
    } catch (error) {
      console.log(error);
      res.end()
  
    }
  
  }
  
  
  async function getEpaymentAPI(req, res) {
    const queryString = 'select * from public.epaymentapisetup'
    const pool = await db.dbConnection()
    try {
  
      pool.query(queryString, function (err, recordset) {
  
        if (err) {
  
          return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))
  
        } else {
          if (recordset.rows.length > 0) {
            // send records as a response
            return res.status(200).json(recordset.rows)
          } else {
            return res.status(402).json('record not found')
          }
  
        }
      });
  
    } catch (error) {
      console.log(error);
      res.end()
  
    }
  
  }
  
  
  async function getEpaymentAPIByID(req, res) {
    const id = req.params.id;
    const pool = await db.dbConnection()
  
    const queryString = `select * FROM public.epaymentapisetup WHERE id=${id}`
  
    try {
  
      pool.query(queryString, function (err, recordset) {
  
        if (err) {
  
          return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))
  
        } else {
          if (recordset.rows.length > 0) {
            // send records as a response
            return res.status(200).json(recordset.rows)
          } else {
            return res.status(402).json('record not found')
          }
        }
      });
  
    } catch (error) {
      console.log(error);
      res.end()
  
    }
  
  }
  
  // async function getEPaymentAPIID(req, res) {
  //   const id = req.params.id;
  //   const pool = await db.dbConnection()
  //   const queryString = `select * FROM public.epaymentapisetup WHERE id=${id}`
  
  //   try {
  
  //     pool.query(queryString, function (err, recordset) {
  
  //       if (err) {
  
  //         return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))
  
  //       } else {
  //         if (recordset.rows.length > 0) {
  //           // send records as a response
  //           return res.status(200).json(recordset.rows)
  //         } else {
  //           return res.status(402).json('record not found')
  //         }
  
  //       }
  //     });
  
  //   } catch (error) {
  //     console.log(error);
  //     res.end()
  
  //   }
  
  // }
  
  
  async function updateEpaymentAPI(req, res) {
  
    const id = req.params.id;
    const pool = await db.dbConnection();
  
    const values = [
      req.body.description,
      req.body.requesturl,
      req.body.statusurl,
      req.body.payloadtypeid,
      req.body.apikey,
      req.body.secretkey,
      req.body.apiuserid,
      req.body.code,
      req.body.requestbody,
      req.body.statusbody,
      req.body.isactive,
      usermachinename = 'DESKTOP',
      usermachineip = '127.0.0.1',
      req.body.createuserid
    ];
    console.log(values)
    const findonequery = 'SELECT * FROM public.epaymentapisetup WHERE id = ($1)';
    //console.log(values)
    const updateonequery = `UPDATE public.epaymentapisetup SET description ='${req.body.description}', requesturl='${req.body.requesturl}',
     statusurl='${req.body.statusurl}', payloadtypeid='${req.body.payloadtypeid}', apikey='${req.body.apikey}', secretkey='${req.body.secretkey}', 
     userid='${req.body.apiuserid}', code='${req.body.code}', requestbody='${req.body.requestbody}', statusbody='${req.body.statusbody}', 
     active='${req.body.isactive}', usermachinename='${usermachinename}', usermachineip='${usermachineip}', updatetime='${moment(new Date())}', 
     updateuserid='${req.body.createuserid}' WHERE id = '${id}' returning *`;
  
    const confirmed = await helper.confirmRecord(findonequery, id);
  
    if (confirmed) {
  
      try {
        //update is done here
        await pool.query(updateonequery, (err, resp, next) => {
  
          if (err) {
            helper.parseError(err, updateonequery)
  
            // Pool result will be undefined
            console.log("SQL result:", res);
  
          } else {
            res.status(201).json({ 'message': 'updated succesfully' });
  
          }
        });
  
  
      } catch (error) {
        console.log('UPDATE-ERROR', error)
        throw error
      }
  
  
    } else {
  
      res.status(404).json({ 'message': 'Update failed: record does not exist' });
  
    }
  
  };

  module.exports={
    getEpaymentPayloadTypes,
    createEpaymentAPI,
    getEpaymentAPI,
    getEpaymentAPIByID,
    updateEpaymentAPI
  }