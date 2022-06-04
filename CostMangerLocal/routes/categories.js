var express = require('express');
const Category = require('../models/Category');



var router = express.Router();

/* GET users listing. */
router.get('/all', async function (req, res, next) {
    const allCategories = await Category.find({});
    res.render('Categories/allCategories.ejs',{"categories":allCategories})
});

router.get('/new',  function (req, res, next) {
    res.render('Categories/newCategory.ejs');
});

router.post('/new', async function (req, res, next) {
    // console.log(req.body['categoryName']);
    console.log(req.body);
    const newCategory =  new Category(req.body);
    console.log(`new category:${newCategory}`);
    await newCategory.save()
    .then((newCategory) =>
    {
        console.log(`created: ${newCategory}`);
        // res.sendStatus(201);
        res.redirect('/categories/all')
    }).catch((error) => {console.log(error);})

    
});





module.exports = router;
