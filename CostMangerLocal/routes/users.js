var express = require('express');
const User = require('../models/User');
const Category = require('../models/Category');
const Cost = require('../models/Cost');
const { ErrorObject } = require('./ErrorObject');
const e = require('express');


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
  res.render('home', { 'user': user });
});

// rout that get all the costs of the user (by userId)
router.get('/:id/costs', async function (req, res, next) {
  // const user = await User.findById(req.params.id,'cost').sort({'category': 1}).populate('costs');
  try {

    const costs = await Cost.find({ userId: Number(req.params.id) }).sort({ category: 'asc' });

    res.render('costs/allCosts', { "costs": costs, 'id': req.params.id });
  }
  catch (error) {
    res.send(error);
  }
  // res.render('costs/allCosts', { "costs": user.costs, 'id': req.params.id });

});

// rout for creating new cost
router.get('/:id/costs/new', async function (req, res, next) {

  const categories = await Category.find({});

  res.render('costs/newCost.ejs', { 'categories': categories, 'id': req.params.id });

});

// rout for handling  new cost creation request
router.post('/:id/costs', async function (req, res) {

  const newCost = new Cost(req.body);

  newCost['date'] = req.body.date === "" ?
    newCost['date'] = new Date().toISOString().split('T')[0] :
    newCost['date'] = new Date(req.body.date).toISOString().split('T')[0];


  // if the date is empty fill  today date
  /*   if (req.body.date === "") {
      newCost['date'] = new Date().toISOString().split('T')[0];
  
    }
    else {
      newCost['date'] = new Date(req.body.date).toISOString().split('T')[0];
  
    } */

  const user = await User.findById(req.params.id);

  user.costs.push(newCost); // insert new cost to costs list of current logged in user..
  newCost.userId = req.params.id;;
  console.log(newCost);

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
router.delete('/:id/costs/:costId', async function (req, res) {
  // find the cost which user ask to delete

  // find all costs related to current user.
  try {
    const costToDelete = await Cost.findOneAndDelete({ _id: req.params.costId });
    // successfully delete -> the return value is null or empty if there is no cost with geven id to delete
    if (costToDelete !== null) {
      console.log("Delete cost: " + costToDelete);

      Cost.find({ userId: req.params.id }, function (err, fittingCosts) {
        if (err) {
          res.send("Error: " + err);
        }
        else {
          User.findByIdAndUpdate(req.params.id, { "costs": fittingCosts }, function (err, result) {
            if (err) {
              res.send(err);
            }
            else {
              console.log("Updated user costs: " + fittingCosts);
              res.redirect(`/users/${req.params.id}/costs`);
            }

          });
        }
      });
    }
  }
  catch (err) {
    res.send("Error: " + err);
  }
});


module.exports = router;
