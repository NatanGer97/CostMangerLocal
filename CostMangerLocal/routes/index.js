const { response } = require('express');
var express = require('express');
var router = express.Router();
const User = require('../models/User');
const { ErrorObject } = require("./ErrorObject");

let utilsFunctions = {};

/**
 * function for Login verification
 */
utilsFunctions.LoginValidation = async function (userName, password) {
  try {
    const result = await User.findOne({ 'userName': userName, 'password': password });
    return result;
  }
  catch (error) {
    console.log(`Some Error was occurred: ${error}`);
  }
}

// rout for enter page (sign in or sign up)
router.get('/', function (req, res) {
  res.render('index');
});

router.get('/credits', function (req, res)
 {  
    res.render('credits');
 });

// rout for retrieve login page
router.get('/login', function (req, res) {
  res.render('users/SignIn.ejs');
});

/**
 * rout that handel the login post request
 */
router.post('/login', async function (req, res, next) {

  // checks if the given username and password are match to some user in DB
  const LoginValidationResults = await utilsFunctions.LoginValidation(req.body.userName, req.body.password);

  // if its not null  -> user with given details was found
  if (LoginValidationResults !== null) {

    res.redirect(`/users/${LoginValidationResults._id.toString()}`);

  } // else -> show  error page with err info
  else {

    const errorObject = new ErrorObject('User Not Exist Or you have enter wrong credentials', req.url);

    res.render('Errors/errorPage', { errorObject });
  }
});

// rout for Sign-Up of new user page
router.get('/signUp', async function (req, res, next) {

try{
     // retrieving the next id for new user
    const users = await User.find({}).sort({ _id: -1 });

    // In there are no users (first user)
    if (users.length === 0) {
      res.render('users/newUser.ejs', { 'id': 0 });
    }
    res.render('users/newUser.ejs', { 'id': ++users[0]._id });
  }
  catch(error)
  {
    console.log(`Error: ${error}`);
    res.send(error);
  }

});

// rout for handling post request of Signing-Up new user page 
// and saving in the DB
router.post('/signUp', async function (req, res, next) {

  try {
    const fittingUserToUserName = await User.findOne({ 'userName': req.body.userName });

    // user with given email(username) is not exist -> so create new user
    if (fittingUserToUserName === null) {
      let newUser = new User(req.body);
      let userBirthday = req.body.birthday;

      newUser.birthday = userBirthday === '' ?
        new Date().toISOString().split('T')[0] : 
        new Date(userBirthday).toISOString().split('T')[0];

      newUser.save().then((createdUser) => {
      console.log(`newUser created: ${createdUser}`);
      res.redirect(`/users/${req.body._id}/`);

      }).catch((error) => {
        res.send(error); 
        console.log(`Error: ${error}`);
      });
    }
    else // in case user with given username already exist
    {
      let errorObject = new ErrorObject
      (`User with the username: ${req.body.userName} already exist`, req.url);
      res.render('Errors/errorPage', { errorObject });
    }
  }
  catch (err) { 
    res.send(err + " err");
   }
});

router.get('/signout', async function (req, res, next) {  
  
  res.redirect('/');

});

module.exports = router;