var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var dbConfig = require('../../../config');


const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;

//GET OUTLETS
async function getOutlets(req, res, error) {

    const queryString = 'SELECT * FROM public.outlets'
    const pool = await db.dbConnection()
  
    try {
  
      const row_count = await pool.query(queryString)
  
      if (row_count.rowCount > 0) {
  
        // send records as a response
        return res.status(200).json(row_count.rows)
  
      } else {
        return res.status(404).json({ 'message': 'failed with no records found' })
      }
  
    } catch (error) {
  
      return res.status(402).json('record not found with error: ' + helper.parseError(error, queryString))
  
    }
  
  }
  
  
  //GET OUTLET BY ID
  
  async function getOutletsByID(req, res, error) {
  
    const id = req.params.id;
    const queryString = `select * FROM public.outlets WHERE outletid='${id}'`
    const pool = await db.dbConnection()
  
    try {
  
      pool.query(queryString, function (err, recordset) {
  
        if (err) {
  
          return res.status(400).json('record not found with error: ' + helper.parseError(err, queryString))
  
        } else {
          if (recordset.rows.length > 0) {
            // send records as a response
            return res.status(200).json(recordset.rows)
          } else {
            return res.status(404).json({ 'message': 'failed' })
          }
  
        }
      });
  
    } catch (error) {
      return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
  
    }
  
  }
  
  
  
  //ADD OUTLET
  
  async function createOutlet(req, res) {
  
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
  
        return res.status(201).json({ 'message': 'success' })
      } else {
  
        return res.status(402).json({ 'message': 'failed' })
  
      }
  
    } catch (error) {
  
      return res.status(400).json('record insert failed with error: ' + helper.parseError(error, createQuery))
    }
  }

  //UPDATE OUTLET
  async function updateOutlet(req, res) {

    const id = req.params.id;
    const pool = await db.dbConnection();
  
    const values = [
      req.body.name,
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
  
    const updateonequery = `UPDATE public.outlets SET outlet_name='${req.body.name}', tax_id='${req.body.taxID}', 
      country_id='${req.body.countryID}', region_id='${req.body.regionID}', city_id='${req.body.cityID}', email='${req.body.email}', 
      contactnumbers='${req.body.contactnumber}', modified_date='${moment(new Date())}', modifier_userid='${req.body.userid}',
      isactive='${req.body.isactive}', usermachinename ='${userMachineName}', usermachineip='${userMachineIP}' WHERE outletid = '${id}' returning *`;
  
    try {
  
      pool.query(updateonequery, function (err, recordset) {
  
        if (err) {
  
          return res.status(402).json('record update failed with error: ' + helper.parseError(err, updateonequery))
  
        } else {
          if (recordset.rowCount > 0) {
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
  };
  module.exports={
    getOutlets,
    getOutletsByID,
    createOutlet,
    updateOutlet
  }