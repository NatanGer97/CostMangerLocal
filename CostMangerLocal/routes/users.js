var express = require('express');
const User = require('../models/User');
const Category = require('../models/Category');
const Cost = require('../models/Cost');
const { ErrorObject } = require('./ErrorObject');


var router = express.Router();

let CurrentLoggedInUser = null;


// /* GET users . */
// router.get('/', async function (req, res, next) {
//   const users = await User.find({});
//   res.render('users/showAll', { "users": users })

// });


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



/* router.post('/', async function (req, res) {
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
    res.render('Errors/userExist',);
  }
  //  console.log(`newUser${newUser}`);

  //  await newUser.save().then((newUser)=>{
  //     console.log(`created: ${newUser}`);
  //     res.redirect('/users/')  
  //   }).catch((error)=> {
  //     console.log(error);
  //   });

});
 */

router.get('/:id', async function (req, res, next) {

  const user = await User.findById(req.params.id);
  console.log(user);
  CurrentLoggedInUser = user;
  // res.render('users/showUser', { "user": user });
  res.render('home', { 'user': user });
});

// rout that get all the costs of the user (by userId)
router.get('/:id/costs', async function (req, res, next) {
  const user = await User.findById(req.params.id).populate('costs');

  res.render('costs/allCosts', { "costs": user.costs, 'id': req.params.id });
  
});

// for postman
router.get('/:id/allCosts', async function (req, res, next) {
  // const user = await User.findById(req.params.id).populate('costs');
  const costs = await Cost.find({userId: req.params.id});
  const fittingCosts = costs.filter(cost =>  cost.date.split('-')[1] === req.query.month.toString());
  console.log(fittingCosts);

  // res.send( costs[0].date.split('-')[1] === '06');
  res.send(fittingCosts);
  
});

// only from postman
router.get('/:id/report', async function (req, res, next) {
  const costs = await Cost.find({userId: req.params.id});
  res.send(costs);


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
  newCost.userId = req.params.id;;
  console.log(newCost);


  // res.send(user);

  await user.save();

  // saving the new created cost 
  await newCost.save().then((newCost) => {
    console.log(`created: ${newCost}`);
    res.redirect(`/users/${req.params.id}/costs`);
  }).catch((error) => {
    console.log(error);
  });

});

// Deleting cost
router.post('/:id/costs/:costId', async function (req, res) {
  // find the cost which user ask to delete

  // find all costs related to current user.
  let userCosts = await User.findOne({ _id: req.params.id }).select(['costs']);

  // filters user costs in order to get only the cost that is not need to be deleted
  userCosts = userCosts['costs'].filter(cost => cost._id.toString() !== req.params.costId.toString());
  console.log(userCosts);

  await User.findOneAndUpdate(req.params.id, { 'costs': userCosts })
    .then(function () {
      // delete the desired cost and redirect back to All Cost page
      Cost.deleteOne({ _id: req.params.costId }).then((deleteResults) => { console.log(`Deleted succeeded`); }).catch((error) => console.log(`Error: ${error}`));

      res.redirect(`/users/${req.params.id}/costs`);
    })
    .catch(function (error) {
      res.send(error);
    });
  
});


module.exports = router;
