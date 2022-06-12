const { render } = require('ejs');
var express = require('express');
var router = express.Router();
const User = require('../models/User');
const { ErrorObject } = require("./ErrorObject");

let CurrentLoggedInUser = null;

// rout for enter page (sign in or sign up)
router.get('/', function (req, res, next) {
  res.render('index');
});


router.get('/home', function (req, res, next) {
  if (CurrentLoggedInUser !== null) {
    res.redirect(`/users/${CurrentLoggedInUser._id.toString()}`);
    // render('home.ejs', { user: CurrentLoggedInUser });
  }
  else {
    // if there is connected user
      let errorObject = new ErrorObject('You must login first','/login','Login');
    res.render('Errors/errorPage', {errorObject})
    // res.render('Errors/errorPage', { msg: "User not Exist", back: '/login',backButtonText:'Login' })

  }


});

router.get('/login', function (req, res, next) {
  res.render('users/SignIn.ejs');

});


router.post('/login', function (req, res, next) {
  User.findOne({ 'userName': req.body.userName, 'password': req.body.password })
    .then((result) => {
      if (result !== null) {
        CurrentLoggedInUser = result;
        console.log(CurrentLoggedInUser['_id']);
        res.redirect(`/users/${result._id.toString()}`);
        // res.send(CurrentLoggedInUser._id.toString());
        // res.render('home', { 'user': result });
      }
      else {
        let errorObject = new ErrorObject('User Not Exist Or you have enter wrong credentials',req.url);
        res.render('Errors/errorPage', {errorObject})
        // res.render('Errors/errorPage', { msg: "User not Exist", back: req.url, backButtonText:'tr'})
      }

    })
    .catch((err) => res.send(`Error: ${err}`));
});


// rout for Sign-Up of new user page
router.get('/new', async function (req, res, next) {

  // retrieving the next id for new user
  const users = await User.find({}).sort({ _id: -1 });

  // In there are no users (first user)
  if(users.length === 0)
  {
    res.render('users/newUser.ejs', { 'id': 0 });  
  }

  res.render('users/newUser.ejs', { 'id': users[0]._id });

});

// rout for handling post request of Signing-Up new user page 
// and saving in the DB
router.post('/new', async function (req, res, next) {
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
            console.log(`newUser created: ${createdUser}`);
            res.render('home', { user: newUser })
          })
          .catch((error) => {
            res.send(error); // need to be redirect to an error page and not just send the error;
          })

        // res.redirect('home');
      }
      else {
        let errorObject = new ErrorObject(`User  with the name: ${newUser.first_name} already exist`,req.url);
        res.render('Errors/errorPage', {errorObject});
        
      //   res.render('Errors/errorPage', { msg: `User with the name: ${newUser.first_name} already exist`, back: req.url })
       }
    })
    .catch((err) => res.send(`Error: ${err}`));
});

router.get('/signout', async function (req, res, next) {
  loginUser = '';
  res.redirect('/');
});


module.exports = router;
