var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');



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
  
    const pool = await db.dbConnection()
  
    try {
  
      pool.query('select * from orderstatus', function (err, recordset) {
  
        if (err) {
  
          console.log(err)
  
        } else {
  
          // send records as a response
          res.status(200).json(recordset.rows);
        }
      });
  
  
    } catch (error) {
  
      console.log(error)
  
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

    const pool = await db.dbConnection()
  
    try {
  
      const recordset = await pool.query(`select * FROM orderstatus WHERE id='${id}'`)
  
      if (recordset.rowsAffected > 0) {
        return res.status(200).json( recordset.recordset)
        //console.log('userCategory-id', recordset.recordset[0].id)
      } else {
        return {
          message: 'No record found'
        }
  
      }
  
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

async function createOrder(req, res, error) {

  const pool = await db.dbConnection()

  const createOrderQuery = `INSERT INTO public.orders(order_date, ordertime, order_statusid, outletid, order_id, invoiceno, 
    linestotal, totalvalue, supplierid, discount, vatid, awardno, orderterms, ordercomments, createuserid, stageid, statusid)
    VALUES ($1, $2, $3, $4, $4, $5, $6, $7, $8, $8, $9, $10, $11, $12, $13, $15, $16, $17) returning *`;

  const createOrderLinesQuery = `INSERT INTO public.orderlines(orderid, itemid, itemunitid, quantity, unitcost, stocklevel, 
    reorderlevel, remark, approvallevelid, approvalstatusid, stageid, statusid, createtime, createuserid)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) returning *`;


  const ordervalues = [
    req.body.orderDate,
    req.body.orderTime,
    req.body.orderStatID,
    req.body.outletID,
    orderID,
    req.body.invoiceNum,
    req.body.linesTotal,
    req.body.totalValue,
    req.body.supplierID,
    req.body.discount,
    req.body.vatID,
    req.body.awardNo,
    req.body.orderTerms,
    req.body.orderComments,
    req.body.userid,
    req.body.stageID,
    req.body.statusID,
  ];

try {
    await pool.query('BEGIN')
  try {
    const { rows } = await pool.query(createOrderQuery, ordervalues);

    orderID=rows[0].id
   
  for(var i=0; i<req.body.length; i++) {
   
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
      req.body.createTime,
      req.body.userid
    ];
    
    const { orderlinesrows } = await pool.query(createOrderLinesQuery, orderLinesvalues);

}

    pool.query('COMMIT')
    return res.status(201).send({ 'message': 'created succesfully' });

  } catch (error) {
    pool.query('ROLLBACK')
    res.status(400).send(error);
  }

} catch (error) {
  pool.query('ROLLBACK')
  res.status(400).send(error);
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

async function createOrderReceival(req, res, error) {

  const pool = await db.dbConnection()

  const receiveOrderQuery = `INSERT INTO public.orderreceivals(orderid, receiveddate, waybillnumber, sranumber, costtouppercentage, 
    receivalnumber, remark, outletid, usermachinename, usermachineip, createuserid)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *`;

  const receiveOrderLinesQuery = `INSERT INTO public.orderreceivallines(purchaseorderlineid, receivalid, itemid, unitcost, receivedqty,
    receivedunitid, batchnumber, expirydate, outletid, createtime, createuserid, usermachinename, usermachineip)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) returning *`;


  const orderreceivalvalues = [
    req.body.orderID,
    req.body.receivedDate,
    req.body.wayBillNo,
    req.body.sraNo,
    req.body.costPercent,
    req.body.receivalNo,
    req.body.remark,
    req.body.outletID,
    req.body.userMachineName,
    req.body.userMachineIP,
    req.body.userid,
  ];

try {
    await pool.query('BEGIN')
  try {
    const { rows } = await pool.query(createOrderReceival, receiveOrderQuery);

    orderID=rows[0].id
   
  for(var i=0; i<req.body.length; i++) {
   
    var orderReceivalLinesValues = [
      orderID,
      req.body[i].orderlineid,
      req.body[i].receivalid,
      req.body[i].itemid,
      req.body[i].unitcost,
      req.body[i].qty,
      req.body[i].unitid,
      req.body[i].batchno,
      req.body[i].expirydate,
      req.body.outletid,
      req.body.createtime,
      req.body.userMachineName,
      req.body.userMachineIP,
      req.body.userid,
    ];
    
    const { orderlinesrows } = await pool.query(receiveOrderLinesQuery, orderReceivalLinesValues);

}

    pool.query('COMMIT')
    return res.status(201).send({ 'message': 'created succesfully' });

  } catch (error) {
    pool.query('ROLLBACK')
    res.status(400).send(error);
  }

} catch (error) {
  pool.query('ROLLBACK')
  res.status(400).send(error);


}
}
}
  module.exports={
      getOrderStatus,
      getOrderStatusByID,
      createOrder
  }