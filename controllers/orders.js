var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var os = require('os');



/**
 * @swagger
 * /order-status:
 *  get:
 *    summary: Get all taxs
 *    tags: [Orders]
 *    description: Used to get all taxs
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function getOrderStatus(req, res) {

  const queryString = 'select * from public.orderstatus'
  const pool = await db.dbConnection()

  const hostname = await helper.getHosnameIP(req)

  try {

    pool.query(queryString, function (err, recordset) {

      if (err) {

        return res.status(402).json('record not found with error: ' + helper.parseError(err, queryString))

      } else {
        if (recordset.rows.length > 0) {
          // send records as a response
          return res.status(200).json(recordset.rows)
        } else {
          return res.status(402).json({ 'message': 'failed with no records found' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }

}

/**
* @swagger
* path:
*  /orderstatus/id:
*    get:
*      summary: Get orderr status by id
*      tags: [Orders]
*      parameters:
*          name: catID
*          -in: path
*          description: id of orderstatus to fetch
*          schema:
*            type: string
*          required: true
*      responses:
*        '200':
*          description: A succesful response
*          content:
*            application/json:
*/

async function getOrderStatusByID(req, res) {

  const id = req.params.id
  const queryString = `select * FROM orderstatus WHERE id='${id}'`
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
          return res.status(402).json({ 'message': 'failed' })
        }

      }
    });

  } catch (error) {
    console.log(error);
    res.end()

  }

}


/**
 * @swagger
 * /outlet:
 *  post:
 *    summary: Add outlet tax
 *    tags: [Outlets]
 *    description: Used to create tax
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function createOrder(req, res, err) {

  const pool = await db.dbConnection()

  const createOrderQuery = `INSERT INTO public.orders(order_date, ordertime, order_statusid, outletid, invoiceno, 
    linestotal, totalvalue, supplierid, discount, vatid, awardno, orderterms, ordercomments, createuserid, stageid, statusid)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) returning id`;

  const createOrderLinesQuery = `INSERT INTO public.orderlines(orderid, itemid, itemunitid, quantity, unitcost, stocklevel, 
    reorderlevel, remark, approvallevelid, approvalstatusid, stageid, statusid, createtime)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *`;


  const ordervalues = [
    req.body[0].orderDate,
    req.body[0].orderTime,
    req.body[0].orderStatID,
    req.body[0].outletID,
    req.body[0].invoiceNum,
    req.body[0].linesTotal,
    req.body[0].totalValue,
    req.body[0].supplierID,
    req.body[0].discount,
    req.body[0].vatID,
    req.body[0].awardNo,
    req.body[0].orderTerms,
    req.body[0].orderComments,
    req.body[0].userid,
    req.body[0].stageID,
    req.body[0].statusID,
  ];

  try {

    
    await pool.query('BEGIN')

   const records = await pool.query(createOrderQuery, ordervalues)

    orderID = records.rows[0].id
    console.log('id', orderID)

        for (var i = 1; i < req.body.length; ++i) {
  
          var orderLinesvalues = [
            orderID,
            req.body[i].itemID,
            req.body[i].itemUnitID,
            req.body[i].qty,
            req.body[i].unitCost,
            req.body[i].stockLevel,
            req.body[i].reOrderLevel,
            req.body[i].remark,
            req.body[i].approvaLevelID,
            req.body[i].approvaSatusID,
            req.body[i].stageID,
            req.body[i].statusID,
            req.body.createTime
          ];

          await pool.query(createOrderLinesQuery, orderLinesvalues)

  } 

  await pool.query('COMMIT')
  res.status(201).json({ 'message': 'created succesfully' });

}
  catch (error) {

    console.log('inside-error','i am here')
    await pool.query('ROLLBACK')
    res.status(402).json('record insert failed with error: ' + helper.parseError(error))
     
  }
}

/**
 * @swagger
 * /outlet:
 *  post:
 *    summary: Receiver orders
 *    tags: [Orders]
 *    description: Used to receive purcahse orders
 *    responses:
 *      '200':
 *        description: A succesful response
 */

async function createOrderReceival(req, res, err) {

  const pool = await db.dbConnection()
 
  const createQuery = `INSERT INTO public.orderreceivals(orderid, receiveddate, waybillnumber, sranumber, costtouppercentage, 
    receivalnumber, remark, outletid, usermachinename, usermachineip, createuserid)
    VALUES ($1, $2, $3, $4, $5, $6,$7, $8, $9, $10, $11) returning *`;

    const orderReceivalLinesQuery = `INSERT INTO public.orderreceivallines(purchaseorderlineid, receivalid, itemid, unitcost, receivedqty,
      receivedunitid, batchnumber, expirydate, outletid, createtime, usermachinename, usermachineip, createuserid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *`;

    orderID = req.body[0].orderID;
    userMachineName = req.body[0].userMachine;
    userMachineIP = req.body[0].userMachineIP;
    userid = req.body[0].userid;
    outletid = req.body[0].outletID;

    const orderReceivalValues = [
      orderID,
      req.body[0].receivedDate,
      req.body[0].wayBillNo,
      req.body[0].sraNo,
      req.body[0].costPercent,
      req.body[0].receivalNo,
      req.body[0].remark,
      outletid,
      userMachineName,
      userMachineIP,
      userid
    ];

  try {

    await pool.query('BEGIN')

    const recordset = await pool.query(createQuery, orderReceivalValues) 


          for (var i = 1; i < req.body.length; i++) {


            var orderReceivalLinesvalues = [
              req.body[i].orderlineid,
              req.body[i].receivalid,
              req.body[i].itemid,
              req.body[i].unitcost,
              req.body[i].qty,
              req.body[i].unitid,
              req.body[i].batchno,
              req.body[i].expirydate,
              outletid,
              req.body[i].createtime,
              userMachineName,
              userMachineIP,
              userid
            ];


           await pool.query(orderReceivalLinesQuery,orderReceivalLinesvalues)

          }

          await pool.query('COMMIT')
          // send records as a response
          return res.status(201).json({ 'message': 'success' })

  } catch (error) {

    pool.query('ROLLBACK')
    return res.status(402).json('record insert failed with error: ' + helper.parseError(err, createQuery))

  }

}

module.exports = {
  getOrderStatus,
  getOrderStatusByID,
  createOrder,
  createOrderReceival
}