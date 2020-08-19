var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
const Response = require('../util/response');
const respBody = require('../util/response');
var dbConfig = require('../../../config');


const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;

var outletsRes = {};
//GET OUTLETS
async function getOutlets(req, res, error) {
  var resp = new Response.Response(res);

    const queryString = 'SELECT * FROM public.outlets'
    const pool = await db.dbConnection()
  
    try {
  
      const row_count = await pool.query(queryString)
  
      if (row_count.rowCount > 0) {
  
        // send records as a response
        outletsRes= respBody.ResponseBody('success',row_count.rows,row_count.rowCount + ' record(s) found');
        resp.json(200, outletsRes);
  
      } else {
        outletsRes= respBody.ResponseBody('success',row_count.rows,row_count.rowCount + ' record(s) found');
        resp.json(404, outletsRes);
      }
  
    } catch (error) {
  
      outletsRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
    resp.json(404, outletsRes);
    }
  
  }
  
  
  //GET OUTLET BY ID
  
  async function getOutletsByID(req, res, error) {
    var resp = new Response.Response(res);
    var id = req.query.id;
    var queryString = `select * FROM public.outlets WHERE outletid='${id}'`
    const pool = await db.dbConnection()
  
    try {
  
      pool.query(queryString, function (err, recordset) {
  
        if (err) {
  
          outletsRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(err));
    resp.json(404, outletsRes);
    
        } else {
          if (recordset.rows.length > 0) {
            // send records as a response
            outletsRes= respBody.ResponseBody('success',recordset.rows,recordset.rows.length + ' record(s) found');
          resp.json(200, outletsRes);
          } else {
            outletsRes= respBody.ResponseBody('success',recordset.rows,recordset.rows.length + ' record(s) found');
        resp.json(404, outletsRes);
          }
  
        }
      });
  
    } catch (error) {
      outletsRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
      resp.json(404, outletsRes);  
    }
  
  }
  
  
  
  //ADD OUTLET
  
  async function createOutlet(req, res) {
    var resp = new Response.Response(res);
    const values = [
      req.body.outletname,
      req.body.countryID,
      req.body.regionID,
      req.body.cityID,
      req.body.email,
      req.body.contactNumber,
      req.body.taxID,
      req.body.userid,
      moment(new Date()),
      req.body.isactive,
      userMachineName,
      userMachineIP
    ];
    const pool = await db.dbConnection()
  
    const createQuery = `INSERT INTO public.outlets(outlet_name, country_id, region_id, city_id, email, contactnumbers, tax_id, create_userid, 
      create_date, isactive, usermachinename, usermachineip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *`;
  
  
    try {
  
      const row_count = await pool.query(createQuery, values)
      if (row_count.rowCount > 0) {
  
        outletsRes= respBody.ResponseBody('success',row_count.rows,row_count.rowCount + ' record(s) found');
          resp.json(200, outletsRes);
      } else {
  
        outletsRes= respBody.ResponseBody('success',row_count.rows,row_count.rowCount + ' record(s) found');
        resp.json(404, outletsRes);
  
      }
  
    } catch (error) {
  
      outletsRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
      resp.json(404, outletsRes);      }
  }

  //UPDATE OUTLET
  async function updateOutlet(req, res) {

    var resp = new Response.Response(res);
    const id = req.query.id;

    const pool = await db.dbConnection();
  
    const values = [
      req.body.outletname,
      req.body.taxID,
      req.body.countryID,
      req.body.regionID,
      req.body.cityID,
      req.body.email,
      req.body.contactnumber,
      moment(new Date()),
      req.body.userid,
      req.body.isactive
    ];
  
    const updateonequery = `UPDATE public.outlets SET outlet_name='${req.body.outletname}', tax_id='${req.body.taxID}', 
      country_id='${req.body.countryID}', region_id='${req.body.regionID}', city_id='${req.body.cityID}', email='${req.body.email}', 
      contactnumbers='${req.body.contactnumber}', modified_date='${moment(new Date())}', modifier_userid='${req.body.userid}',
      isactive='${req.body.isactive}', usermachinename ='${userMachineName}', usermachineip='${userMachineIP}' WHERE outletid = '${id}' returning *`;
  
    try {
  
      pool.query(updateonequery, function (err, recordset) {
  
        if (err) {
  
          outletsRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(err));
          resp.json(404, outletsRes);    
        } else {
          if (recordset.rowCount > 0) {
          
        outletsRes= respBody.ResponseBody('success',recordset.rows,recordset.rowCount + ' record(s) found');
        resp.json(200, outletsRes);
          } else {
              
        outletsRes= respBody.ResponseBody('success',recordset.rows,recordset.rowCount + ' record(s) found');
        resp.json(404, outletsRes);
          }
  
        }
      });
  
    } catch (error) {
      outletsRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
      resp.json(404, outletsRes);  
    }
  };
  module.exports={
    getOutlets,
    getOutletsByID,
    createOutlet,
    updateOutlet
  }