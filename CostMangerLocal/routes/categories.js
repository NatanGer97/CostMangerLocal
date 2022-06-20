const express = require('express');
const Category = require('../models/Category');
const Cost = require('../models/Cost');

const router = express.Router();

/* get  all categories. */
router.get('/all', async function (req, res) {
    const allCategories = await Category.find({});
    res.render('Categories/allCategories.ejs',{"categories":allCategories});
});

/* rout for page which display form for creation of new category */
router.get('/new', function (req, res) {
    res.render('Categories/newCategory.ejs');
});

/* rout that handles creation request  of new category */
router.post('/new', async function (req, res) {
    
    const newCategory =  new Category(req.body);

    await newCategory.save()
    .then((newCategory) =>
    {
        console.log(`created: ${newCategory}`);
        res.redirect('/categories/all')
    }).catch((error) => {console.log(error);});    
});

router.delete('/:categoryId/delete', async function (req,res) {

    const categoryToDelete = await Category.findById(req.params.categoryId);
    const CostWithTargetCategory = await Cost.find({category: categoryToDelete.name});

    // for each cost update his category to 'general' because his original category would deleted
    for(let cost of CostWithTargetCategory)
    {
        await Cost.findByIdAndUpdate(cost._id,{'category': 'General'})
        .then((results) => console.log(results)).catch((err) => console.log((err)));
    }
    
    Category.findByIdAndDelete(categoryToDelete._id).then(() => {
        console.log("Category deleted");
        res.redirect('/categories/all');
    }).catch((err) => res.send(err)); 
 });

module.exports = router;