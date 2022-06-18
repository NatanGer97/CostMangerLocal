var express = require('express');
const Category = require('../models/Category');
const Cost = require('../models/Cost');
const Report = require('../models/Report');


var router = express.Router();

router.get('/:userId/getReport', function (req, res) {
    res.render('report/getReport', { userId: req.params.userId });

}); 

router.get('/:userId/newReport', async function (req, res) {

    const fullDate = req.query.date;
    
    
    const reportDate = new Date(fullDate).toUTCString();
    const costs = await Cost.find({userId:req.params.userId});
    const yearAndMonth = fullDate.split("-");


    console.log(yearAndMonth);
    
    const year = yearAndMonth[0];
    const month = yearAndMonth[1];

    try{
        const report = await Report.find({userId: req.params.userId, date_created : fullDate});
        
        // case : creating new report
        if  (report.length === 0)
        {
            const costsArray = costs.filter(cost => 
                cost.date.split("-")[1] === month && cost.date.split("-")[0] === year 
            );
            
            let sum = 0;
        
            costsArray.forEach((cost) => sum += cost.sum);
            console.log(sum);
        
            
            const generateNewReport = new Report({
                userId : req.params.userId,
                costs: costsArray,
                totalSum : sum,
                date_created : new Date(fullDate).toISOString().split('-').slice(0,2).join('-'),
            });
            
            await generateNewReport.save(); 
            
            // splitting date in  wed, 14 Jun 2022 07:00:00 GMT form to have only Jun, 2022 via Regex
            const dateInArrFormat = reportDate.split(/\W+/gm).slice(2, 4)
            const reportTitle = (`Report for: ${dateInArrFormat[0]}, ${dateInArrFormat[1]}`);
            
            res.render('report/newReport', 
            { 'reportTitle': reportTitle, 'costs': costsArray, 'totalSum' : sum});
        
        
        
        }
        // checking existing report
        else
        {            
            res.send("already exist");
       
        }


    }catch(err)
    {
        res.send(err);
    }


});


module.exports = router;
