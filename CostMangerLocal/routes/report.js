var express = require('express');
const Category = require('../models/Category');
const Cost = require('../models/Cost');

var router = express.Router();

router.get('/:userId/getReport', function (req, res) {
    // res.send(req.params.userId);
    res.render('report/getReport', { userId: req.params.userId });

});

router.get('/:userId/newReport', async function (req, res) {
    const fullDate = req.query.date;
    const reportDate = new Date(fullDate).toUTCString();
    const costs = await Cost.find({userId:req.params.userId});
    const yearAndMonth = fullDate.split("-");
    console.log(yearAndMonth);
    console.log("Hi Natan");
    
    const year = yearAndMonth[0];
    const month = yearAndMonth[1];
    
    const costsArray = costs.filter(cost => 
        cost.date.split("-")[1] === month && cost.date.split("-")[0] === year 
    );
    
    let sum = 0;

    costsArray.forEach((cost) => sum += cost.sum);
    console.log(sum);

    
    // splitting date in  wed, 14 Jun 2022 07:00:00 GMT form to have only Jun, 2022 via Regex
    const dateInArrFormat = reportDate.split(/\W+/gm).slice(2, 4)
    const reportTitle = (`Report for: ${dateInArrFormat[0]}, ${dateInArrFormat[1]}`);

    // const user = await User.findById(req.params.id).populate('costs');
   /*  const costs = await Cost.find({ userId: req.params.userId });
    const fittingCosts = costs.filter(
        cost =>
            (cost.date.split('-')[1] === req.query.date.split('-')[1] )
            && (( cost.date.split('-')[0] === req.query.date.split('-')[0] ))
            
        );

    let totalSumInThisMonth = 0;

    fittingCosts.forEach(cost => {
        totalSumInThisMonth += cost.sum;
    });
    
    console.log(totalSumInThisMonth); */

    /* for self testing */
    // console.log(reportDate.split(/\W+/gm).slice(2,4));    

    res.render('report/newReport', 
    { 'reportTitle': reportTitle, 'costs': costsArray, 'totalSum' : sum});

});


module.exports = router;
