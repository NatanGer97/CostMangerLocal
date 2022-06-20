const express = require('express');
const User = require('../models/User');
const Category = require('../models/Category');
const Cost = require('../models/Cost');

const router = express.Router();

// rout for main page of current user
router.get('/:id', async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    console.log(user);
    CurrentLoggedInUser = user;
    res.render('home', { 'user': user });

  } catch (error) {
    res.send(`Error: ${error}`);
  }

});

// rout that get all the costs of the user (by userId)
router.get('/:id/costs', async function (req, res, next) {

  try {
    // return all user costs sort by category field
    const costs = await Cost.find({ userId: Number(req.params.id) }).sort({ category: 'asc' });

    res.render('costs/allCosts', { 'costs': costs, 'id': req.params.id });
  }
  catch (error) {
    res.send(`Error: ${error}`);
  }
});

// rout for creating new cost
router.get('/:id/costs/new', async function (req, res, next) {

  try {

    const categories = await Category.find({});
    res.render('costs/newCost.ejs', { 'categories': categories, 'id': req.params.id });

  } catch (error) {

    res.send(`Error: ${error}`);
  }

});

// rout for handling  new cost creation request
router.post('/:id/costs', async function (req, res) {

  const newCost = new Cost(req.body);

  // if the date is empty, fill today date
  newCost['date'] = req.body.date === "" ?
    newCost['date'] = new Date().toISOString().split('T')[0] :
    newCost['date'] = new Date(req.body.date).toISOString().split('T')[0];

    const user = await User.findById(req.params.id);

    user.costs.push(newCost); // insert new cost to costs list of current user..
    newCost.userId = req.params.id;;
    await user.save();

    // saving new cost 
    newCost.save().then(newCost => {
    console.log('newCost was created: ' + newCost);
    res.redirect(`/users/${req.params.id}/costs`);

  }).catch((error) => {
    console.log(error);
    res.send(`Error: ${error}`);
  });

});

module.exports = router;