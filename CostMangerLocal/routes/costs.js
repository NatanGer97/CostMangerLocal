const express = require('express');
const Category = require('../models/Category');
const User = require('../models/User');
const Cost = require('../models/Cost');

const router = express.Router();



// rout for get all cost of current user
router.get('/:userId/', async function (req, res, next) {
  try {
    // return all user costs sort by category field
    console.log(req.params);
    const costs = await Cost.find({userId: req.params.userId});
    console.log(costs);
    res.render('costs/allCosts', { 'costs': costs, 'id': req.params.userId });
  }
  catch (error) {
    console.log(error);
    res.send(`Error: ${error}`);
  }
});


// rout for get all cost of current usr sorted by user choice( price or category)
router.get('/:userId/sort', async function (req, res) {
  let costs = [];

  try {
      
    if(req.query.sortBy === 'category')
    {
       costs = await Cost.find({userId: req.params.userId}).sort({category: 'asc'});
    }
    if(req.query.sortBy === 'price')
    {
       costs = await Cost.find({userId: req.params.userId}).sort({sum: 'asc'});
    }
  
    res.render('costs/allCosts', { 'costs': costs, 'id': req.params.userId });
  }
  catch (error) {
    console.log(error);
    res.send(`Error: ${error}`);
  }
});



// rout for handling  new cost creation request
router.post('/:userId/', async function (req, res) {

  const newCost = new Cost(req.body);

  // if the date is empty, fill today date
  newCost['date'] = req.body.date === "" ?
    newCost['date'] = new Date().toISOString().split('T')[0] :
    newCost['date'] = new Date(req.body.date).toISOString().split('T')[0];

    const user = await User.findById(req.params.userId);

    user.costs.push(newCost); // insert new cost to costs list of current user..
    newCost.userId = req.params.userId;;
    await user.save();

    // saving new cost 
    newCost.save().then(newCost => {
    console.log('newCost was created: ' + newCost);
    res.redirect(`/costs/${req.params.userId}`);

  }).catch((error) => {
    console.log(error);
    res.send(`Error: ${error}`);
  });

});

// rout for page that display the specific cost related to current login user.
router.get('/:userId/:costId', async function (req, res, next) {

  try {
    const targetCostToDisplay = await Cost.findById(req.params.costId);

    // if the targetCostToDisplay is empty -> it means thar cost with given id is not exist
    if (targetCostToDisplay === null) {

    res.send("Cant find the requested cost");
    
    }

    res.render('costs/showCost', {
      'cost': targetCostToDisplay,
      'backLink': `/costs/${req.params.userId}`, 'id': req.params.userId
    });
  }
  catch (err) {
    res.send("Error accrued:" + err);
  }
});

// rout for get an edit page
router.get("/:userId/:costId/edit", async function (req, res) {

  try {
    const targetCostToUpdated = await Cost.findById(req.params.costId);
    const categories = await Category.find({});

    res.render("costs/editCost", {
      id: req.params.userId, cost: targetCostToUpdated,
      categories: categories, backLink:`/costs/${req.params.userId}/${req.params.costId}`
    });
  } catch (error) {
    res.send(error);
  }
});

// rout that handel the edit request (put request)
router.put('/:userId/:costId', async function (req, res) {
  try {
    const updatedCost = req.body;
    const targetCostToUpdated = await Cost.findByIdAndUpdate(req.params.costId, updatedCost);

    if (targetCostToUpdated == null) {
      res.send("error did not find cost with given id");
    }
    else {
      res.redirect(`/costs/${req.params.userId.toString()}/${req.params.costId.toString()}`);
    }
  }
  catch (err) {
    res.send("error: " + err);
  }
});


// Deleting cost
router.delete('/:userId/:costId', async function (req, res) {

  try {
    const costToDelete = await Cost.findOneAndDelete({ _id: req.params.costId });
    // successfully delete -> the return value is null or empty if there is no cost with given id to delete
    if (costToDelete !== null) {
      console.log("Delete cost: " + costToDelete);

      Cost.find({ userId: req.params.userId }, function (err, fittingCosts) {
        if (err) {
          res.send("Error: " + err);
        }
        else {
          User.findByIdAndUpdate(req.params.userId, { "costs": fittingCosts }, function (err, result) {
            if (err) {
              res.send(err);
            }
            else {
              console.log("Updated user costs: " + fittingCosts);
              res.redirect(`/costs/${req.params.userId}`);
            }
          });
        }
      });
    }
  }
  catch (err) {
    res.send("Error: k" + err);
  }
});


module.exports = router;