var express = require('express');
const Cost = require('../models/Cost');
const Category = require('../models/Category');

var router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const costs = await Cost.find({});
  res.render('costs/allCosts', { "costs": costs })

});


router.get('/new',  async function (req, res, next) {
    const categories = await Category.find({});
    console.log(categories);
    res.render('costs/newCost.ejs',{'categories':categories});

  /*   const costCategories = await Category.find({});   
  res.render('costs/newCost.ejs',{'categories':costCategories}); */
});

/* router.get('/:id', async function (req, res, next) {
  const user = await User.findById(req.params.id);
  console.log(user);
  res.render('users/showUser', { "user": user })


}); */
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
