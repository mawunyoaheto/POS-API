var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const db = require('../util/db_worm');

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

module.exports={
Helper,
confirmRecord
}