var express = require('express');
const User = require('../models/User');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const Cost = require('../models/Cost');
const { render } = require('ejs');
const { ErrorObject } = require('./ErrorObject');


var router = express.Router();

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
  // res.render('users/showUser', { "user": user });
  res.render('home', { 'user': user });
});

router.get('/:id/costs', async function (req, res, next) {
  const user = await User.findById(req.params.id);
  // res.send(new Date(user.costs[0].date.split('.')[2],user.costs[0].date.split('.')[1]+1,user.costs[0].date.split('.')[0]));  
  // console.log(user);
  res.render('costs/allCosts', { "costs": user.costs, 'id': req.params.id});
});

router.get('/:id/costs/new', async function (req, res, next) {
  const categories = await Category.find({});
  console.log(req.params);
  const { id } = req.params.id;

  res.render('costs/newCost.ejs', { 'categories': categories, 'id': req.params.id });

});

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
  // console.log(newCost.date);
  // res.send(newCost.date);
  // res.send(newCost.date.toISOString().split('T')[0]);


  const user = await User.findById(req.params.id);  
  user.costs.push(newCost);
  console.log(newCost); 
  await user.save();
  await newCost.save().then((newCost)=>{
     console.log(`created: ${newCost}`);
     res.redirect(`/users/${req.params.id}/costs`);
   }).catch((error)=> {
     console.log(error);
   });

});

/* router.post('/clicked',function (req,res) 
{
  const click = {clickTime: new Date().toLocaleDateString()};

  const clicked_user =  new User({
    first_name: "Avi",
    last_name: "Levi",
    birthday: new Date().toLocaleDateString(),
    marital_status: "Married"
});
  console.log(click);
  clicked_user.save(function (error) {
    if(error)
    {
      console.log(error);
    }
    else
    {
      console.log(clicked_user);
      res.sendStatus(201);}
    });
  
});
 */
module.exports = router;
