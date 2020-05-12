var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const db = require('../util/db_worm');
var os = require('os');

const Helper = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  },
  /**
   * comparePassword
   * @param {string} hashPassword 
   * @param {string} password 
   * @returns {Boolean} return True or False
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  /**
   * Gnerate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken(id) {
    const token = jwt.sign({
      userId: id
    },
      process.env.SECRET, { expiresIn: '7d' }
    );
    return token;
  },

}

async function confirmRecord(queryString, queryValues, res, next) {

  try {

    // create Request object
    const pool = await db.dbConnection()
    //console.log(queryString)
    //console.log(queryValues)
    try {

      const recordset = await pool.query(`${queryString}`, [`${queryValues}`])

      const numRows = recordset.rowCount
      console.log(numRows)
      if (numRows > 0) {

        return true
      } else {
        return false
      }
    } catch (error) {

    }

  } catch (error) {

    res.status(400).json({ message: error })

    console.log(error);
    return false
  }
}

async function getHosnameIP(req) {

  var ipAddress;

  try {

    //hostName = os.hostname()
    ipAddress = (req.headers['x-forwarded-for'] || '').split(',')[0]
      || req.connection.remoteAddress;

    // if (!ipAddress) {
    //   return '';
    // }

    // // convert from "::ffff:192.0.0.1"  to "192.0.0.1"
    //   if (ipAddress.substr(0, 7) == "::ffff:") {
    //     ipAddress = ipAddress.substr(7)
    //   }

    console.log(ipAddress)
    return ipAddress

  } catch (error) {
    res.json({ message: error })
  }

}

function parseError(err, sqlString) {
  console.log("nparseError:", sqlString)

  let errorCodes = {
    "08003": "connection_does_not_exist",
    "08006": "connection_failure",
    "2F002": "modifying_sql_data_not_permitted",
    "57P03": "cannot_connect_now",
    "42601": "syntax_error",
    "42501": "insufficient_privilege",
    "42602": "invalid_name",
    "42622": "name_too_long",
    "42939": "reserved_name",
    "42703": "undefined_column",
    "42000": "syntax_error_or_access_rule_violation",
    "42P01": "undefined_table",
    "42P02": "undefined_parameter"
  };

  if (err === undefined) {
    console.log("No errors returned from Postgres")
  }

  else {

    if (err.message !== undefined) {
      console.log('ERROR message:', err.message)
    }

    if (err.code !== undefined) {
      console.log("Postgres error code:", err.code)

      if (errorCodes[err.code] !== undefined) {
        console.log('Error code details:', errorCodes[err.code])
      }
    }

    console.log('severity:', err.severity)

    if (err.position !== undefined) {

      console.log("PostgreSQL error position:", err.position)

      // get the end of the error pos
      let end = err.position + 7
      if (err.position + 7 >= sqlString.length) {
        end = sqlString.length
      }

      // get the start position for SQL error
      let start = err.position - 2
      if (err.position - 2 <= 1) {
        start = 0
      }

      // log the partial SQL statement around error position
      console.log("---> " + sqlString.substring(start, end) + " <---")
    }

    if (err.code === undefined && err.position === undefined) {
      console.log("nUnknown Postgres error:", err)
    }
  }
}

module.exports = {
  Helper,
  confirmRecord,
  getHosnameIP,
  parseError
}