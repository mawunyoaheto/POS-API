var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var dbConfig = require('../../../config');
var Response = require('../util/response');
var respBody = require('../util/response');
const { error } = require('../util/winston');

const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;
var suppliersRes = {};
//SUPPLIERS

async function getSuppliers(req, res, error) {
  var resp = new Response.Response(res);

  const queryString = 'SELECT * FROM public.suppliers'
  const pool = await db.dbConnection()

  try {

    const row_count = await pool.query(queryString)

    if (row_count > 0) {

      suppliersRes = respBody.ResponseBody('success', row_count.rows, row_count.rowCount + ' record(s) found');
      resp.json(201, suppliersRes);

    } else {

      suppliersRes = respBody.ResponseBody('success', row_count.rows, row_count.rowCount + ' record(s) found');
      resp.json(404, suppliersRes);
    }

    //res.status(200).json(recordset.rows);

  }
  catch (error) {

    suppliersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
    resp.json(404, suppliersRes);
  }
}


async function getSupplierByID(req, res) {
  var resp = new Response.Response(res);
  const id = req.query.id;
  const pool = await db.dbConnection()
  const query = `SELECT * FROM public.suppliers WHERE supplierid ='${id}'`

  try {

    pool.query(query, function (err, recordset) {

      if (err) {

        suppliersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(err));
        resp.json(404, suppliersRes);
      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          suppliersRes = respBody.ResponseBody('success', recordset.rows, recordset.rows.length + ' record(s) found');
          resp.json(200, suppliersRes);
        } else {
          suppliersRes = respBody.ResponseBody('success', recordset.rows, recordset.rows.length + ' record(s) found');
          resp.json(404, suppliersRes);
        }

      }
    });

  } catch (error) {
    suppliersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
    resp.json(404, suppliersRes);
  }

}

//Create supplier

async function createSupplier(req, res) {
  var resp = new Response.Response(res);
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

    pool.query(createQuery, values, function (req, res, error) {

      if (err) {

        suppliersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
        resp.json(404, suppliersRes);
      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          suppliersRes = respBody.ResponseBody('success', recordset.rows, recordset.rows.length + ' record(s) added');
          resp.json(200, suppliersRes);
        } else {
          suppliersRes = respBody.ResponseBody('success', recordset.rows, recordset.rows.length + ' record(s) added');
          resp.json(404, suppliersRes);
        }

      }
    });

  } catch (error) {
    suppliersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
    resp.json(404, suppliersRes);
  }
}


//update supplier

async function updateSupplier(req, res, error) {
  var resp = new Response.Response(res);
  const id = req.query.id;
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

    //console.log('update', row_count.rowCount)
    if (row_count.rowCount > 0) {

      suppliersRes = respBody.ResponseBody('success', row_count.rows, row_count.rowCount + ' record(s) updated');
      resp.json(200, suppliersRes);

    } else {

      suppliersRes = respBody.ResponseBody('success', row_count.rows, row_count.rowCount + ' record(s) updated');
          resp.json(404, suppliersRes);
    }
  }
  catch (error) {
    suppliersRes = respBody.ResponseBody('failed', '', 'failed with error: ' + helper.parseError(error));
    resp.json(404, suppliersRes);
  }
}
module.exports = {
  getSuppliers,
  getSupplierByID,
  createSupplier,
  updateSupplier
}  