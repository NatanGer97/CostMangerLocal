var express = require('express');
var router = express.Router();
const User = require('../models/User');
const { ErrorObject } = require("./ErrorObject");

let CurrentLoggedInUser = null;


/**
 * function for Login verification
 */
async function LoginValidation(userName,password)
{
  try
  {
    const result = await User.findOne({'userName': userName, 'password': password});
    return result;
  }
  catch(error) 
  {
    console.error(`Could not get products: ${error}`);
  }  
}

// rout for enter page (sign in or sign up)
router.get('/', function (req, res, next) {
  res.render('index');
});


router.get('/home', function (req, res, next) {
  if (CurrentLoggedInUser !== null) {
    // save the current logged in user;
    res.redirect(`/users/${CurrentLoggedInUser._id.toString()}`);

  }
  else {

    // if there is no connected user
    let errorObject = new ErrorObject('You must login first', '/login', 'Login');
    res.render('Errors/errorPage', { errorObject });
  }
});

// rout for login page
router.get('/login', function (req, res, next) {
  res.render('users/SignIn.ejs');
});


/**
 * rout that handel the login post request
 */
router.post('/login', async function (req, res, next) {

  // checks if the given username and password are match to some user in DB
  const LoginValidationResults = await LoginValidation(req.body.userName, req.body.password);
  
  // if its not null  -> user with given details was found
  if (LoginValidationResults !== null) {
    CurrentLoggedInUser = LoginValidationResults;
    console.log(CurrentLoggedInUser['_id']);
    res.redirect(`/users/${LoginValidationResults._id.toString()}`);
    
  } // else show page error with err info
  else {
    let errorObject = new ErrorObject('User Not Exist Or you have enter wrong credentials', req.url);
    res.render('Errors/errorPage', { errorObject })
    
    // res.render('Errors/errorPage', { msg: "User not Exist", back: req.url, backButtonText:'tr'})
  }
  
});
/* 
  User.findOne({ 'userName': req.body.userName, 'password': req.body.password })
    .then((result) => {
      // if match -> make the user as the logged in user and move to home page 
      if (result !== null) {
        CurrentLoggedInUser = result;
        console.log(CurrentLoggedInUser['_id']);
        res.redirect(`/users/${result._id.toString()}`);
        
      }
      else {
        let errorObject = new ErrorObject('User Not Exist Or you have enter wrong credentials', req.url);
        res.render('Errors/errorPage', { errorObject })
        // res.render('Errors/errorPage', { msg: "User not Exist", back: req.url, backButtonText:'tr'})
      }

    })
    .catch((err) => res.send(`Error: ${err}`)); 

    */


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
  const newUser = new User(req.body);

  // if the birthday is empty, fill with today date
  if (req.body.birthday === '') {

    //  splitting, in order to obtain only the date without the time part
    newUser['birthday'] = new Date().toISOString().split('T')[0];
  }
  else {
    newUser['birthday'] = new Date(req.body.birthday).toISOString().split('T')[0];
  }

  User.findOne({ 'first_name': newUser.first_name })
    .then((result) => {
      if (result === null) {
        // res.send(req.body);

        newUser.save()
          .then((createdUser) => {
            CurrentLoggedInUser = newUser;
            console.log(`newUser created: ${createdUser}`);
            // res.render('home', { user: newUser })
            res.redirect('home');
          })
          .catch((error) => {
            res.send(error); // need to be redirect to an error page and not just send the error;
          })

        // res.redirect('home');
      }
      else {
        let errorObject = new ErrorObject(`User  with the name: ${newUser.first_name} already exist`, req.url);
        res.render('Errors/errorPage', { errorObject });

        //   res.render('Errors/errorPage', { msg: `User with the name: ${newUser.first_name} already exist`, back: req.url })
      }
    })
    .catch((err) => res.send(`Error: ${err}`));
});

router.get('/signout', async function (req, res, next) {
  loginUser = null;
  
  res.redirect('/');
});


module.exports = router;
