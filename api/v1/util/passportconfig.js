const LocalStrategy = require('passport-local').Strategy;
const db = require('../util/db_worm');
const helper = require('../util/helper');
var dbConfig = require('../../../config');
const authenticateUser = require('../util/authenticate');

const pool =  db.dbConnection()

function initialize(passport){

    passport.use(new LocalStrategy({
        usernameField: "username",
        passwordField: "password"

    },
    authenticateUser.authUser
    ));

    passport.serializeUser((user, done)=>done(null, user.id));

    passport.deserializeUser((id, done)=>{
        pool.query(`SELECT * FROM public.users WHERE id =$1`,[id], (err, results) =>{

            if(err){
                throw err
            }

            return done(null, results.rows[0])
        })
    });
    
}

module.exports=initialize