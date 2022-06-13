var express = require('express');
const Cost = require('../models/Cost');


var router = express.Router();


// rout for  page that display the specific cost related to current login user.
  router.get('/:userId/:costId', async function (req, res, next) {

    const targetCostToDisplay = await Cost.findById(req.params.costId);   

    res.render('costs/showCost',{'cost': targetCostToDisplay, 'backLink': `/users/${req.params.userId}/costs`, 'id':req.params.userId});  
  });


module.exports = router;
