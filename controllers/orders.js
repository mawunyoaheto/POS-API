var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var os = require('os');
const { help } = require('../util/winston');
var dbConfig = require('../config');

const userid = `${dbConfig.app_user}`;
const userMachineName = `${dbConfig.userMachine}`;
const userMachineIP = `${dbConfig.userIP}`;

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

//GET OUTLETS
async function getOrdersSummary(req, res, error) {

  var orders = {}
  const invoiceNo = req.params.invoiceNo
  const queryString = `SELECT * FROM public.orders WHERE archived = false and invoiceno= '${invoiceNo}'`
  const pool = await db.dbConnection()

  try {

    const row_count = await pool.query(queryString)

    if (row_count.rowCount > 0) {

      orders.summary = row_count.rows[0]
      orders.summary.details = await getOrderDetails(row_count.rows[0].id)

      return res.status(200).json(orders)

    } else {
      return res.status(404).json({ 'message': 'failed with no records found' })
    }

  } catch (error) {

    return res.status(402).json('record not found with error: ' + helper.parseError(error, queryString))

  }

}

//CREATE PURCHASE ORDER
async function createOrder(req, res, err) {

  const pool = await db.dbConnection()

  const createOrderQuery = `INSERT INTO public.orders(invoiceno, awardno, linestotal, totalvalue, supplierid, discount, vatid, orderterms, 
    ordercomments, outletid, createuserid, stageid, statusid, order_date, ordertime, usermachinename, usermachineip)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) returning id`;

  const createOrderLinesQuery = `INSERT INTO public.orderlines(orderid, itemid, itemunitid, quantity, unitcost, stocklevel, 
    reorderlevel, remark, approvallevelid, approvalstatusid, stageid, statusid, createtime)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *`;


  let totalValue = helper.sumOfArrayWithParameter(req.body.orderdetails, 'unitCost');

  console.log(totalValue)

  const ordervalues = [
    req.body.invoiceNum,
    req.body.awardNo,
    req.body.orderdetails.length,
    totalValue,
    req.body.supplierID,
    req.body.discount,
    req.body.vatID,
    req.body.orderTerms,
    req.body.orderComments,
    req.body.outletID,
    req.body.create_userid,
    req.body.stageID,
    req.body.statusID,
    req.body.orderDate,
    req.body.orderTime,
    userMachineName,
    userMachineIP
  ];

  try {

    

    await pool.query('BEGIN')

   const records = await pool.query(createOrderQuery, ordervalues)

    orderID = records.rows[0].id

        for (var i = 0; i < req.body.orderdetails.length; ++i) {
  
          var orderLinesvalues = [
            orderID,
            req.body.orderdetails[i].itemID,
            req.body.orderdetails[i].itemUnitID,
            req.body.orderdetails[i].qty,
            req.body.orderdetails[i].unitCost,
            req.body.orderdetails[i].stockLevel,
            req.body.orderdetails[i].reOrderLevel,
            req.body.orderdetails[i].remark,
            req.body.orderdetails[i].approvaLevelID,
            req.body.orderdetails[i].approvaSatusID,
            req.body.orderdetails[i].stageID,
            req.body.orderdetails[i].statusID,
            req.body.createTime
          ];

          await pool.query(createOrderLinesQuery, orderLinesvalues) 

  } 

  await pool.query('COMMIT')
  res.status(201).json({ 'message': 'success' });

}
  catch (error) {
    await pool.query('ROLLBACK')
    res.status(402).json('record insert failed with error: ' + helper.parseError(error, createOrderQuery))
     
  }
}

async function getOrderDetails(orderID) {

  const queryString = `select * from public.orderlines WHERE orderid='${orderID}'`
  const pool = await db.dbConnection()

  try {

   const recordset = await  pool.query(queryString) 

        if (recordset.rowCount > 0) {
          // send records as a response
          return recordset.rows

        } else {
          return res.status(404).json({ 'message': 'failed' })
        }

  } catch (error) {
    return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
  }

}

async function getPendingOrderApprovalDetails(orderID) {

  const queryString = `select * from public.orderlines WHERE orderid='${orderID}' and stageid =10 `
  const pool = await db.dbConnection()

  try {

   const recordset = await  pool.query(queryString) 

        if (recordset.rowCount > 0) {
          // send records as a response
          return recordset.rows

        } else {
          return res.status(404).json({ 'message': 'failed' })
        }

  } catch (error) {
    return res.status(400).json('record not found with error: ' + helper.parseError(error, queryString))
  }

}

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
    return res.status(402).json('record insert failed with error: ' + helper.parseError(error, createQuery))

  }

}

//APPROVE PURCHASE ORDER
async function approveOrder(req, res, err) {

  const pool = await db.dbConnection()

  const approveOrderQuery = `INSERT INTO public.orderapprovals(purchaseorderid, approverid, approvalnumber, outletid, remark, 
    approvallevelid, approvaldate,servertime, createtime, createuserid, usermachinename, usermachineip)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning id`;

  const approvalLinesQuery = `INSERT INTO public.orderapprovallines(purchaseorderlineid, productid, unitcost, approvedqty, 
    productunitid, reorderlevel, stocklevel, remarks, outletid, baseitemid, createtime, approvalid, createuserid, servertime, 
    usermachinename, usermachineip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) returning *`;


  //let totalValue = helper.sumOfArrayWithParameter(req.body.orderdetails, 'unitCost');

 // console.log(totalValue)

  const orderApprovalValues = [
    req.body.purchaseOrderID,
    req.body.approverId,
    req.body.approvalNo,
    outletID = req.body.outletID,
    req.body.remark,
    req.body.approvalLevelId,
    req.body.approvalDate,
    moment(new Date()),
    moment(new Date()),
    req.body.create_userid,
    userMachineName,
    userMachineIP
  ];

  try {

    

    await pool.query('BEGIN')

   const records = await pool.query(approveOrderQuery, orderApprovalValues)

    purchaseOrderLineID = records.rows[0].id

        for (var i = 0; i < req.body.orderdetails.length; ++i) {
  
          var orderApprovalLinesvalues = [
            purchaseOrderLineID,
            req.body.orderdetails[i].productID,
            req.body.orderdetails[i].unitCost,
            req.body.orderdetails[i].approvedtQty,
            req.body.orderdetails[i].productUnitID,
            req.body.orderdetails[i].reOrderLevel,
            req.body.orderdetails[i].stockLevel,
            req.body.orderdetails[i].remarks,
            outletID,
            req.body.orderdetails[i].baseItemID,
            moment(new Date()),
            req.body.orderdetails[i].approvalID,
            req.body.orderdetails[i].create_userid,
            moment(new Date()),
            userMachineName,
            userMachineIP
          ];

          await pool.query(approvalLinesQuery, orderApprovalLinesvalues) 

  } 

  await pool.query('COMMIT')
  res.status(201).json({ 'message': 'success' });

}
  catch (error) {
    await pool.query('ROLLBACK')
    res.status(402).json('record insert failed with error: ' + helper.parseError(error, approveOrderQuery))
     
  }
}

//GET ORDERS PENDING APPROVAL
async function getPendingOrdersSummary(req, res, error) {

  //const invoiceNo = req.params.invoiceNo
  //const queryString = `SELECT * FROM public.orders WHERE archived = false and invoiceno= '${invoiceNo}'and stageid= 10`
  const queryString = `SELECT * FROM public.orders WHERE archived = 'false' and stageid= 10`
  const pool = await db.dbConnection()

  try {

    const row_count = await pool.query(queryString)

    if (row_count.rowCount > 0) {

      var orderSummary ={}
      // var orderID = row_count.rows[0].id
      // var orderSummary = row_count.rows[0]

      // orderSummary.details = await getPendingOrderApprovalDetails(orderID)
      var pendingOrders = []
       // var details =[]

      for (var i = 0; i < row_count.rowCount; i++ ){

        var orderID = row_count.rows[i].id
        orderSummary = row_count.rows[i]

        orderSummary.details = await getPendingOrderApprovalDetails(orderID)

        // var ordertransaction ={
        //   summary: orderSummary,
        //   details: details
        // }
        //pendingOrders.push(ordertransaction)
        pendingOrders.push(orderSummary)

      }
      
      return res.status(200).json(pendingOrders)

    } else {

      return res.status(404).json({ 'message': 'failed with no records found' })
    }

  } catch (error) {

    return res.status(402).json('record not found with error: ' + helper.parseError(error, queryString))

  }

}

//GET ORDERS PENDING APPROVAL BY INVOICE NO
async function getPendingOrdersSummaryByInvoice(req, res, error) {

  const invoiceNo = req.params.invoiceNo
  const queryString = `SELECT * FROM public.orders WHERE archived = false and invoiceno= '${invoiceNo}'and stageid= 10`

  const pool = await db.dbConnection()

  try {

    const row_count = await pool.query(queryString)

    if (row_count.rowCount > 0) {
     
      var orderSummary ={}
        var orderID = row_count.rows[0].id
        var orderSummary = row_count.rows[0]

        orderSummary.details = await getPendingOrderApprovalDetails(orderID)

      return res.status(200).json(orderSummary)

    } else {

      return res.status(404).json({ 'message': 'failed with no records found' })
    }

  } catch (error) {

    return res.status(402).json('record not found with error: ' + helper.parseError(error, queryString))

  }

}

module.exports = {
  getOrderStatus,
  getOrderStatusByID,
  createOrder,
  createOrderReceival,
  getOrdersSummary,
  approveOrder,
  getPendingOrdersSummary,
  getPendingOrdersSummaryByInvoice
}