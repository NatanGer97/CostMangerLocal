var express = require('express');
const session = require('express-session');
var router = express.Router();
const User = require('../models/User');
const { ErrorObject } = require("./ErrorObject");

let CurrentLoggedInUser = null;

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
    console.error(`Could not get products: ${error}`);
  }
}




// rout for enter page (sign in or sign up)
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/credits', function (req, res)
 {  
    res.render('credits');

 });

router.get('/home', function (req, res, next) {

  if (CurrentLoggedInUser !== null) {

    res.redirect(`/users/${CurrentLoggedInUser._id.toString()}`);

  }
  else {

    // if there is no connected user
    let errorObject = new ErrorObject('You must login first', '/login', 'Login');
    res.render('Errors/errorPage', { errorObject });
  }
});

// rout for retrieve login page
router.get('/login', function (req, res, next) {

  res.render('users/SignIn.ejs');
});


/**
 * rout that handel the login post request
 */
router.post('/login', async function (req, res, next) {

  // checks if the given username and password are match to some user in DB
  const LoginValidationResults = await utilsFunctions.LoginValidation(req.body.userName, req.body.password);
  // const LoginValidationResults = await LoginValidation(req.body.userName, req.body.password);

  // if its not null  -> user with given details was found
  if (LoginValidationResults !== null) {
    CurrentLoggedInUser = LoginValidationResults;

    console.log(CurrentLoggedInUser['_id']);

    res.redirect(`/users/${LoginValidationResults._id.toString()}`);

  } // else -> show  error page with err info
  else {
    let errorObject = new ErrorObject('User Not Exist Or you have enter wrong credentials', req.url);
    res.render('Errors/errorPage', { errorObject })

    // res.render('Errors/errorPage', { msg: "User not Exist", back: req.url, backButtonText:'tr'})
  }

});


// rout for Sign-Up of new user page
router.get('/signUp', async function (req, res, next) {

  // retrieving the next id for new user
  const users = await User.find({}).sort({ _id: -1 });
  console.log(users);

  // In there are no users (first user)
  if (users.length === 0) {
    res.render('users/newUser.ejs', { 'id': 0 });
  }

  res.render('users/newUser.ejs', { 'id': ++users[0]._id });

});

// rout for handling post request of Signing-Up new user page 
// and saving in the DB
router.post('/signUp', async function (req, res, next) {

  try {
    const fittingUserToUserName = await User.findOne({ 'userName': req.body.userName });

    // user with given email(username) is not exist -> so create new user
    if (fittingUserToUserName === null) {
      console.log(req.body);
      let newUser = new User(req.body);
      let userBirthday = req.body.birthday;

      newUser.birthday = userBirthday === '' ?
        new Date().toISOString().split('T')[0] : new Date(userBirthday).toISOString().split('T')[0];

      newUser.save().then((createdUser) => {

        CurrentLoggedInUser = newUser;

        console.log(`newUser created: ${createdUser}`);
        res.redirect('home');

      }).catch((error) => {
        res.send(fittingUserToUserName + " error"); // need to be redirect to an error page and not just send the error;
      });
    }
    else // in case user with given username already exist
    {
      let errorObject = new ErrorObject(`User  with the username: ${req.body.userName} already exist`, req.url);

      res.render('Errors/errorPage', { errorObject });
    }


  }
  catch (err) { res.send(err + " err"); }


});

router.get('/signout', async function (req, res, next) {

  CurrentLoggedInUser = null;
  res.redirect('/');

});


module.exports = router;
