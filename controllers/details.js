var express = require('express');
var winston = require('../util/winston');
const bodyParser = require("body-parser");
const Response = require('../util/response');

var caughtError = {};


function home_page(req, res) {
    // res.send('Wecome To CoronaVirus updates Home Page')
    res.json({ info: 'Node.js, Express, and Postgres Corona Virus API' })
}

module.exports = {
    home_page,
    
}