var express = require('express');
const Category = require('../models/Category');
const Cost = require('../models/Cost');

var router = express.Router();

router.get('/:userId/getReport', function (req, res) {
    // res.send(req.params.userId);
    res.render('report/getReport', { userId: req.params.userId });

});

router.get('/:userId/newReport', async function (req, res) {
    const reportDate = new Date(req.query.date).toUTCString();


    // splitting date in  wed, 14 Jun 2022 07:00:00 GMT form to have only Jun, 2022 via Regex
    const dateInArrFormat = reportDate.split(/\W+/gm).slice(2, 4)
    const reportTitle = (`Report for: ${dateInArrFormat[0]}, ${dateInArrFormat[1]}`);


    /* for self testing */
    // console.log(reportDate.split(/\W+/gm).slice(2,4));    

    res.render('report/newReport', 
    { 'reportTitle': reportTitle, 'costs':[]});

});


module.exports = router;
