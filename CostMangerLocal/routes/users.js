var express = require('express');
const User = require('../models/User');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const Cost = require('../models/Cost');
const { render } = require('ejs');
const { ErrorObject } = require('./ErrorObject');


var router = express.Router();

let CurrentLoggedInUser = null;


/* GET users listing. */
router.get('/', async function (req, res, next) {
  const users = await User.find({});
  res.render('users/showAll', { "users": users })

});


/* router.get('/test', async function (req, res) {
  try {
    const users = await User.find({})
    console.log(users.length);
    res.send(users.length.toString())
  }
  catch (error) {
    console.log(error);
  }

});
 */
// router.get('/new', async function (req, res, next) {
//   const users = await User.find({});
//   console.log(users.length.toString());
//   res.render('users/newUser.ejs', { 'id': users.length });
// });



router.post('/', async function (req, res) {
  const newUser = new User(req.body);

  // for debugging propose
  //  console.log(req.body); 

  // if the birthday is empty fill with today date
  if (req.body.birthday === '') {
    // console.log('True');
    newUser['birthday'] = new Date().toLocaleDateString();
  }
  else {
    // localDateString - convert to local date format (dd.mm.yyyy)
    newUser['birthday'] = new Date(req.body.birthday).toLocaleDateString();

  }

  // console.log('ff' +  LoginValidation(newUser));

  if (LoginValidation(newUser).length === 0) {
    res.redirect('/users/')

  }
  else {
    const errObj = new ErrorObject()
    res.render('Errors/userExist', );
  }
  //  console.log(`newUser${newUser}`);

  //  await newUser.save().then((newUser)=>{
  //     console.log(`created: ${newUser}`);
  //     res.redirect('/users/')  
  //   }).catch((error)=> {
  //     console.log(error);
  //   });

});

router.get('/:id', async function (req, res, next) {

  const user = await User.findById(req.params.id);
  console.log(user);
  CurrentLoggedInUser = user;
  // res.render('users/showUser', { "user": user });
  res.render('home', { 'user': user });
});

router.get('/:id/costs', async function (req, res, next) {
  const user = await User.findById(req.params.id).populate('costs');
 
  res.render('costs/allCosts', { "costs": user.costs, 'id': req.params.id});
});

// rout for creating new cost
router.get('/:id/costs/new', async function (req, res, next) {
  const categories = await Category.find({});
  const { id } = req.params.id;  // todo: check if this var is use else delete it unused var

  console.log(req.params); // login for self testing need to be delete before submitting

  res.render('costs/newCost.ejs', { 'categories': categories, 'id': req.params.id });

});

// rout for handling  new cost creation request
router.post('/:id/costs', async function (req, res) {
  // res.send(req.body);
  const newCost = new Cost(req.body);

  // if the date is empty fill  today date
  if (req.body.date === "") {
    newCost['date'] = new Date().toISOString().split('T')[0];
    console.log(new Date(newCost['date']));

  }
  else {
    newCost['date'] = new Date(req.body.date).toISOString().split('T')[0];
    console.log(new Date(newCost['date']));

    }

  const user = await User.findById(req.params.id);  
   
  user.costs.push(newCost); // insert new cost to costs list of current logged in user..
  console.log(newCost); 
  // res.send(user);

  await user.save();
  
  // saving the new created cost 
  await newCost.save().then((newCost)=>{
     console.log(`created: ${newCost}`);
     res.redirect(`/users/${req.params.id}/costs`);
   }).catch((error)=> {
     console.log(error);
   });

});

// Deleting cost
router.post('/:id/costs/:costId', async function (req,res) 
{  

   
  // const costToDelete = await Cost.findById(req.params.costId);
  // const userToDeleteFrom = await User.findById(req.params.id);
  // console.log(userToDeleteFrom.costs[0]._id.toString());
  // console.log(req.params.costId.toString());
  // res.json(costToDelete);

  // userToDeleteFrom.costs.forEach(cost => {
  //   if (cost._id.toString() === req.params.costId.toString())
  //   {
      
  //     res.send(i.toString());
  //   }
  // });
  // for(let cost in userToDeleteFrom.costs)
  // {
  //   console.log(cost._id);
  //   if (cost._id == req.params.costId.toString())
  //   {
  //     res.send('find');
  //   }
  // }
  
});


module.exports = router;
