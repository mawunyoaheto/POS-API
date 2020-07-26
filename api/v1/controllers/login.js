const passport = require('passport');
const initializePassport = require('../util/passportconfig')

function login(req, res) {
  
  passport.authenticate("local",{
      successRedirect: "/dashboard",
      failureRedirect: "/"
  })
  }

  module.exports={
      login
  }