const Sequelize = require('sequelize');
var dbConfig = require('../config');

// your credentials
const connectionString = 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb';

const database = new Sequelize(DATABASE_URL);

module.exports = database;
