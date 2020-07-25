var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var dbConfig = require('../../../config');


const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;



async function getItemBaseUnits(req, res) {
  const queryString = 'select * from public.itembaseunits'
  const pool = await db.dbConnection()
  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).send(recordset.rows)
        } else {
          return res.status(404).json('record not found')
        }

      }
    });

  } catch (error) {
    return res.status(400).json('record not found with error: ' + helper.parseError(err, queryString))
  }

}


async function getItemBaseUnitByID(req, res) {
  const id = req.params.id;

  const pool = await db.dbConnection()

  const queryString = `select * FROM public.itembaseunits WHERE id=${id}`

  try {

    pool.query(queryString, function (err, recordset) {

      if (recordset.rows.length > 0) {
        // send records as a response
        return res.status(200).json(recordset.rows)
      } else {
        return res.status(404).json('record not found')
      }
    });

  } catch (error) {
    return res.status(400).json('record not found with error: ' + helper.parseError(err, queryString))

  }

}


//add item base unit
async function createItemBaseUnit(req, res) {

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

    await pool.query(createQuery, values)

    //}
    //await pool.query('COMMIT')
    return res.status(201).json({ 'message': 'success' })


  } catch (error) {

    pool.query('ROLLBACK')
    return res.status(402).json('record insert failed with error: ' + helper.parseError(error, createQuery))

  }
}


//update item base unit
async function updateItemBaseUnit(req, res, error) {

  const id = req.params.id;
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

      return res.status(201).json({ 'message': 'success' })

    } else {

      return res.status(404).json({ 'message': 'not found' })
    }


  } catch (err) {
    return res.status(400).json('record insert failed with error: ' + helper.parseError(err, updateonequery))
  }

}


module.exports = {
  getItemBaseUnits,
  getItemBaseUnitByID,
  createItemBaseUnit,
  updateItemBaseUnit,
}