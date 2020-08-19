const LocalStrategy = require('passport-local').Strategy;
const db = require('../util/db_worm');
const helper = require('../util/helper');
const passport = require('passport');
const bcrypt = require('bcrypt')


//function initialize(passport){

async function authUser(req, username, password, done) {

  const queryString = `SELECT id, first_Name, username, password FROM users WHERE username ='${username}'`



  try {
    const pool = await db.dbConnection()
    await pool.query(queryString, function (err, results) {

      if (err) {
        throw err
      }
      console.log(results.rows[0])

      if (results.rows.length > 0) {
        const user = results.rows[0]

        bcrypt.compare(password, user.password, (err, isMatch) => {

          if (err) {
            throw err
          }

          if (isMatch) {
            return done(null, user)
          }
          else {
            return done(null, false, { message: "Password is not correct" })
          }
        })
      }

      else {
        return done(null, false, { message: "Wrong username entered" })
      }
    })
  } catch (error) {
    //return res.status(400).json('failed with error: ' + helper.parseError(error, createQuery))
  }
}

passport.use(new LocalStrategy({

  passReqToCallback: true
},

  authUser
));


// passport.use('local', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {

//   loginAttempt();

//   async function loginAttempt() {


//     const client = await db.dbConnection()
//     try {
//       await client.query('BEGIN')
//       var currentAccountsData = await JSON.stringify(client.query(`SELECT id, first_Name, username, password FROM users WHERE username=$1`,
//        [username], function (err, result) {

//         if (err) {
//           console.log(err)
//           return done(err)
//         }
//         if (result.rows[0] == null) {
//           console.log('Incorrect login details')
//           req.flash('danger', "Oops. Incorrect login details.");
//           return done(null, false);
//         }
//         else {
//           console.log(result.rows[0].password,password)
//           bcrypt.compare(password, result.rows[0].password, function (err, check) {
//             if (err) {
//               console.log('Error while checking password');
//               return done();
//             }
//             else if (check) {
//               console.log('Valid Credentials')
//               return done(null, [{ username: result.rows[0].username, firstName: result.rows[0].first_Name }]);
//             }
//             else {
//               console.log('Oops. Incorrect login details.')
//               req.flash('danger', "Oops. Incorrect login details.");
//               return done(null, false);
//             }
//           });
//         }
//       }))
//     }

//     catch (e) { throw (e); }
//   };

// }
// ))
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});


module.exports = passport