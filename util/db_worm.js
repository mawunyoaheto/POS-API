const { Pool, Client } = require('pg');
var dbConfig = require('../config');
var winston = require('../util/winston');

// your credentials

console.log('Host',dbConfig.db_host)
console.log('Port',dbConfig.db_port)
console.log('User',dbConfig.user)
console.log('Password',dbConfig.password)
console.log('Database',dbConfig.database)

const pool = new Pool({
  //connectionString: DATABASE_URL
  "host":`${dbConfig.db_host}`,
  "port":`${dbConfig.db_port}`,
  "user":`${dbConfig.user}`,
  "password":`${dbConfig.password}`,
  "database":`${dbConfig.database}`
});

// pool.query('select Now()', (err, res)=> {
//   console.log(err,res)
//   pool.end()
// })


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