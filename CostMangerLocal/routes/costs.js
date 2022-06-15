var express = require('express');
const Category = require('../models/Category');
const Cost = require('../models/Cost');


var router = express.Router();


// rout for  page that display the specific cost related to current login user.
router.get('/:userId/:costId', async function (req, res, next) {

  try {
    const targetCostToDisplay = await Cost.findById(req.params.costId);

    // if the targetCostToDisplay is empty -> it means thar cost with given id is not exist
    if (!targetCostToDisplay) {
      res.send("Empty data");
    }

    res.render('costs/showCost', { 'cost': targetCostToDisplay, 'backLink': `/users/${req.params.userId}/costs`, 'id': req.params.userId });
  }
  catch (err) {
    res.send("Error accrued:" + err);
  }


});

router.get("/:userId/:costId/edit", async function (req, res) {
  const targetCostToUpdated = await Cost.findById(req.params.costId);
  const categories = await Category.find({});
  
  res.render("costs/editCost",{id: req.params.userId, cost: targetCostToUpdated,
  categories: categories});

});

router.post('/:userId/:costId', async function (req, res) {
  try {
    const targetCostToUpdated = await Cost.findByIdAndUpdate(req.params.costId, req.body);

    if (targetCostToUpdated == null) {
      res.send("error did not find cost with given id");
    }
    else {
      // res.send(targetCostToUpdated);
      res.redirect(`/costs/${req.params.userId.toString()}/${req.params.costId.toString()}`);

    }


  }
  catch (err) {
    res.send("error: " + err);

  }

});

module.exports = router;
