var express = require('express');
var router = express.Router();
const User = require('../models/User');




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/home', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {

  res.render('users/SignIn.ejs');
});
router.post('/login', function(req, res, next) {
  User.findOne({'first_name':req.body.first_name})
  .then((result) => 
  {
    if (result !== null)
    {
        User.findOne({'first_name':req.body.first_name})
        .then((user) => res.render('home',{'user': user}));
        
      // res.redirect('home',{});
    }
    else
    {
      res.render('Errors/userExist',{'msg':"User not Exist",back:req.url})
    }
  

    
  })
  .catch((err) => res.send(`Error: ${err}`));
});



router.get('/new',  async function (req, res, next) {
  const users = await User.find({}).sort({_id: -1});
 
  // res.send(`${users[0]._id}`);
  res.render('users/newUser.ejs',{'id':users[0]._id});
});

router.post('/new', async function (req, res, next) {
  const newUser = new User(req.body);

  // if the birthday is empty fill with today date
  if (req.body.birthday === '')
  {
   newUser['birthday'] = new Date().toLocaleDateString(); 
  }
 else
 {
     // localDateString - convert to local date format (dd.mm.yyyy)
   newUser['birthday'] = new Date(req.body.birthday).toLocaleDateString(); 
 
 }  
 
 User.findOne({'first_name':newUser.first_name})
  .then((result) => 
  {
    if (result === null)
    {
      // res.send(req.body);
      
       newUser.save()
      .then((createdUser) => {
        console.log(`newUser created: ${createdUser}`);
        res.render('home',{'user':newUser})
      })
      .catch((error) => {
        res.send(error); // need to be redirect to an error page and not just send the error;
      })
      
      // res.redirect('home');
    }
    else
    {
      res.render('Errors/userExist',{'msg':"User already Exist",back:req.url})
    }    
  })
  .catch((err) => res.send(`Error: ${err}`));
});



module.exports = router;
