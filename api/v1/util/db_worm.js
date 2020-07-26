const { Pool, Client } = require('pg');
var dbConfig = require('../../../config');
var winston = require('../util/winston');

//check if u are in production mode
const isProduction = dbConfig.node_env === "production"

const connectionString = `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.db_host}:${dbConfig.db_port}/${dbConfig.database}`

const pool = new Pool({
  connectionString: isProduction? dbConfig.db_url:connectionString
  // "host":`${dbConfig.db_host}`,
  // "port":`${dbConfig.db_port}`,
  // "user":`${dbConfig.user}`,
  // "password":`${dbConfig.password}`,
  // "database":`${dbConfig.database}`
});


pool.connect(function (err) {
  
  if (err) {
      winston.info(err);
  }
  //console.log('DB Connected successfully')
})
const dbConnection = async () => {    
  return pool;
}

module.exports = {
  dbConnection
}