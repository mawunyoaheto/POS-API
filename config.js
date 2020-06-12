"use strict";

const assert = require("assert");
const dotenv = require('dotenv');


// read in the .env file
dotenv.config();


// capture the environment variables the application needs

const {
    PORT,
    DB_PORT,
    HOST,
    HOST_URL,
    DB_HOST,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    USER_MACHINE_IP,
    USER_MACHINE_NAME,
    APP_USERID
} = process.env;

module.exports = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    db_host: DB_HOST,
    db_port: DB_PORT,
    userMachine: USER_MACHINE_NAME,
    userIP: USER_MACHINE_IP,
    app_user: APP_USERID
      

};
