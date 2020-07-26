const db = require('../util/db_worm');
var dbConfig = require('../../../config');
const bcrypt = require('bcrypt');

const authUser = (username, password, done)=>{

  const pool = db.dbConnection()
    
    try {
      
      pool.query(`select * FROM users WHERE username=$1`,[username],(err,results)=>{

        if (err){
          throw err
        }
        console.log(results.rows)

        if(results.rows.length>0){
          const user = results.rows[0]

          bcrypt.compare(password, user.password, (err,isMatch)=>{
            if(err){
              throw err
            }

            if(isMatch){
              return done(null, user)
            }
            else{
              return done(null, false, {message:"Password is not correct"})
            }
          })
        }

      else{
        return done(null, false, {message:"Wrong username entered"})
      }
      })
    } catch (error) {
      
    }
  }

  module.exports={
      authUser
  }