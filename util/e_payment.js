const request = require('request')
var http = require('http');
var moment = require('moment');
//import uuidv4 from 'uuid/v4';
var uuidv4 = require('uuidv4');
const db = require('../util/db_worm');
const helper = require('../util/helper');
var os = require('os');




var postheaders = {
    'Content-Type' : 'application/json',
    'Host': 'sandbox.momodeveloper.mtn.com',
    'X-Reference-Id':'',
    'X-Target-Environment':'sandbox',
    'Ocp-Apim-Subscription-Key': '972b11ebf863417ca8692d2cee3936de'
};

const requestOptions = {
    headers: postheaders,
    url: 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay',
    method: 'POST',
    json: {},
    body: JSON.stringify({
        "amount":"" ,
        "currency": "EUR",
        "externalId": "string", 
        "payer": {
          "string":"",
          "partyId": "string"
        }, 
        "payerMessage": "wigal",
        "payeeNote": "MTN"
    })
  };
  request(requestOptions, (err, res, body) => {
    if (err) {
      console.log(err);
    } else if (res.statusCode === 200) {
        res.send(body);
      console.log(body);
    } else {
      console.log(res.statusCode);
    }
  });
  
  