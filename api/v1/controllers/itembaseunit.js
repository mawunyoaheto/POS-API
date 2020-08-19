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

var itemBaseRes={};


async function getItemBaseUnits(req, res) {
  var resp = new Response.Response(res);

  const queryString = 'select * from public.itembaseunits'
  const pool = await db.dbConnection()
  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        itemBaseRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
        resp.json(404, itemBaseRes);
      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          itemBaseRes= respBody.ResponseBody('success',recordset.rows,recordset.rows.length + ' record(s) found');
        resp.json(200, itemBaseRes);
        } else {
          itemBaseRes= respBody.ResponseBody('success',row_count.rows,row_count.rowCount + ' record(s) found');
        resp.json(404, itemBaseRes);
        }

      }
    });

  } catch (error) {
    itemBaseRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
    resp.json(404, itemBaseRes);  }

}


async function getItemBaseUnitByID(req, res) {
  var resp = new Response.Response(res);
  const id = req.query.id;

  const pool = await db.dbConnection()

  const queryString = `select * FROM public.itembaseunits WHERE id=${id}`

  try {

    pool.query(queryString, function (err, recordset) {

      if (recordset.rows.length > 0) {
        // send records as a response
        itemBaseRes= respBody.ResponseBody('success',recordset.rows,recordset.rows.length + ' record(s) found');
        resp.json(200, itemBaseRes);
      } else {
        itemBaseRes= respBody.ResponseBody('success',row_count.rows,row_count.rowCount + ' record(s) found');
        resp.json(404, itemBaseRes);
      }
    });

  } catch (error) {
    itemBaseRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
    resp.json(404, itemBaseRes); 
   }
  }


//add item base unit
async function createItemBaseUnit(req, res) {
  var resp = new Response.Response(res);
  const pool = await db.dbConnection()

  const createQuery = `INSERT INTO public.itembaseunits(baseunit, isactive, create_user, usermachinename, usermachineip) 
  VALUES ($1, $2, $3, $4, $5) returning *`;


  try {

    //await pool.query('BEGIN')

    //for (var i = 0; i < req.body.length; i++) {

    const values = [
      req.body.baseunit,
      req.body.isactive,
      userid,
      userMachineName,
      userMachineIP
    ];

   var recordset =  await pool.query(createQuery, values)

    //}
    //await pool.query('COMMIT')
    itemBaseRes= respBody.ResponseBody('success',recordset.rows,recordset.rows.length + ' record(s) found');
    resp.json(200, itemBaseRes);


  } catch (error) {

    itemBaseRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
    resp.json(404, itemBaseRes); 
  }
}


//update item base unit
async function updateItemBaseUnit(req, res, error) {
  var resp = new Response.Response(res);
  const id = req.query.id;
  const pool = await db.dbConnection();

  const values = [
    req.body.baseunit,
    req.body.isactive,
    userid,
    userMachineName,
    userMachineIP
  ];

  const updateonequery = `UPDATE public.itembaseunits SET baseunit='${req.body.baseunit}', isactive='${req.body.isactive}', modified_date='${moment(new Date())}', 
  modifier_userid='${userid}', usermachinename='${userMachineName}', usermachineip='${userMachineIP}' WHERE id = '${id}' returning *`

  try {

    const row_count = await pool.query(updateonequery)

    if (row_count.rowCount > 0) {

      itemBaseRes= respBody.ResponseBody('success',recordset.rows,recordset.rows.length + ' record(s) found');
      resp.json(200, itemBaseRes);

    } else {

      itemBaseRes= respBody.ResponseBody('success',row_count.rows,row_count.rowCount + ' record(s) found');
        resp.json(404, itemBaseRes);
    }


  } catch (error) {
    itemBaseRes= respBody.ResponseBody('failed','','failed with error: ' + helper.parseError(error));
    resp.json(404, itemBaseRes);   }

}


module.exports = {
  getItemBaseUnits,
  getItemBaseUnitByID,
  createItemBaseUnit,
  updateItemBaseUnit,
}