var express = require('express');
var winston = require('../util/winston');
const bodyParser = require("body-parser");
const Response = require('../util/response');
//const index = require('../../../views/index')

var caughtError = {};


function home_page(req, res) {
    res.render('index')
    //res.render('views/index')
    //res.json({ info: 'Node.js, Express, and Postgres Corona Virus API' })
}

function dashboard(req, res) {
    res.render('dashboard')
    //res.json({ info: 'Node.js, Express, and Postgres Corona Virus API' })
}
module.exports = {
    home_page,
    dashboard
}