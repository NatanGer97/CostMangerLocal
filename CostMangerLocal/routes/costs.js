const express = require('express');
const Category = require('../models/Category');
const User = require('../models/User');
const Cost = require('../models/Cost');

const router = express.Router();

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
      'backLink': `/users/${req.params.userId}/costs`, 'id': req.params.userId
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
      categories: categories
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
              res.redirect(`/users/${req.params.userId}/costs`);
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