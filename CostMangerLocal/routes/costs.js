var express = require('express');
const Cost = require('../models/Cost');
const Category = require('../models/Category');

var router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const costs = await Cost.find({});
  res.render('costs/allCosts', { "costs": costs })

});

//$ need to be deleted $
// router.get('/:id', async function (req, res, next) {
//     const targetCostToShow = await Cost.findById(req.params.id);
//     // res.json({costToDelete});
//     // res.send(new Date(targetCostToShow.date).toLocaleDateString())
//     res.render('costs/showCost',{'cost':targetCostToShow});
//   });

// rout for show page that display the specific cost related to current login user.
  router.get('/:userId/:costId', async function (req, res, next) {

    const targetCostToDisplay = await Cost.findById(req.params.costId);    
    res.render('costs/showCost',{'cost': targetCostToDisplay, 'backLink': `/users/${req.params.userId}/costs`});

  
  });

// rout for creating new cost
// router.get('/new',  async function (req, res, next) {
//     const categories = await Category.find({});
//     console.log(categories);
//     res.render('costs/newCost.ejs',{'categories':categories});
// });

router.post('/',async function (req,res) {
    const newCost = new Cost(req.body);
    await newCost.save(function(error,newCostItem)
    {
        if(error){
            console.log(error);
        }
        else{
            console.log(newCostItem);
            res.redirect('/costs/');
        }
    });
});


module.exports = router;
