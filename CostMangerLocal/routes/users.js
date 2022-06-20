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



// rout for creating new cost
router.get('/:id/costs/new', async function (req, res, next) {
  try {

    const categories = await Category.find({});
    res.render('costs/newCost.ejs', 
    { 'categories': categories, 'id': req.params.id, backLink: req.url });

  } catch (error) {

    res.send(`Error: ${error}`);
  }

});

module.exports = router;