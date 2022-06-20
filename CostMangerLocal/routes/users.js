var express = require('express');
const User = require('../models/User');
const Category = require('../models/Category');
const Cost = require('../models/Cost');
const { ErrorObject } = require('./ErrorObject');
const e = require('express');



var router = express.Router();


let CurrentLoggedInUser = null;



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

  // if the date is empty fill  today date
  newCost['date'] = req.body.date === "" ?
    newCost['date'] = new Date().toISOString().split('T')[0] :
    newCost['date'] = new Date(req.body.date).toISOString().split('T')[0];

  const user = await User.findById(req.params.id);

  user.costs.push(newCost); // insert new cost to costs list of current logged in user..
  newCost.userId = req.params.id;;
  // similar to update
  await user.save();

  // saving new cost 
  newCost.save().then(newCost => {
    console.log(`newCost was created: ` + newCost);
    res.redirect(`/users/${req.params.id}/costs`);

  }).catch((error) => {
    console.log(error);
    res.send("Error" + error);
  });

});

// Deleting cost
router.delete('/:id/costs/:costId', async function (req, res) {
 
  try {
    const costToDelete = await Cost.findOneAndDelete({ _id: req.params.costId });
    // successfully delete -> the return value is null or empty if there is no cost with given id to delete
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
        }});
    }
  }
  catch (err) {
    res.send("Error: " + err);
  }
});

module.exports = router;