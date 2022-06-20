const express = require('express');
const Cost = require('../models/Cost');
const Report = require('../models/Report');
const router = express.Router();

let reportUtilsFunctions = {};

// function that creates title for report
reportUtilsFunctions.createReportTitle = function (reportDate) {

    // splitting date in  wed, 14 Jun 2022 07:00:00 GMT form to have only Jun, 2022 via Regex
    const dateInArrFormat = reportDate.split(/\W+/gm).slice(2, 4);
    return `Report for: ${dateInArrFormat[0]}, ${dateInArrFormat[1]}`;
};

// function for find fitting cost to asked report by date
reportUtilsFunctions.findFittingCost = function (costs, month, year) {
    return costs.filter(cost =>
        cost.date.split("-")[1] === month && cost.date.split("-")[0] === year
    );
};

// function which calc total sum of cost
reportUtilsFunctions.calcTotalSumOfReport = function (costsArray) {
    let sum = 0;
    costsArray.forEach((cost) => sum += cost.sum);
    console.log(sum);
    return sum;
};

router.get('/:userId/allReports', async function (req, res) {
    try {
        const allReports = await Report.find({ userId: req.params.userId }).populate('costs');
        res.render('report/allReports', { 'reports': allReports, "userId": req.params.userId });
    }
    catch (err) {
        res.send("Error" + err);
    }
});


router.get('/:userId/getReport', function (req, res) {
    res.render('report/getReport', { userId: req.params.userId });
});

router.get('/:userId/newReport', async function (req, res) {

    const fullDate = req.query.date;
    const reportDate = new Date(fullDate).toUTCString();
    const costs = await Cost.find({ userId: req.params.userId });
    const yearAndMonth = fullDate.split("-");
    const year = yearAndMonth[0];
    const month = yearAndMonth[1];

    const reportTitle = reportUtilsFunctions.createReportTitle(reportDate);

    // user costs that fitting to desire costs
    const costsArray = reportUtilsFunctions.findFittingCost(costs, month, year);
    let sum = 0;
    try {

        const report = await Report.find({ userId: req.params.userId, date_created: fullDate });
        // case : creating new report
        if (report.length === 0) {

            const totalSum = reportUtilsFunctions.calcTotalSumOfReport(costsArray);
            sum = totalSum;

            const generateNewReport = new Report({
                userId: req.params.userId,
                title: reportTitle,
                costs: costsArray,
                totalSum: totalSum,
                date_created: new Date(fullDate).toISOString().split('-').slice(0, 2).join('-'),
            });

            await generateNewReport.save();
            console.log('new report was created');
        }
        // checking existing report
        else {
            // case: report need get update (if cost was deleted or added)
            if (report[0].costs.length !== costsArray.length) {
                console.log("updating existing report");

                const totalSum = reportUtilsFunctions.calcTotalSumOfReport(costsArray);
                sum = totalSum;

                await Report.findByIdAndUpdate(report[0]._id, { totalSum: totalSum, costs: costsArray });              
            } else { // case: the report is up to date
                console.log("giving previous report");
            }
        }
        res.render('report/newReport',
            {
                'reportTitle': reportTitle,
                'costs': costsArray, 'totalSum': sum === 0 ? report[0].totalSum : sum,
                'userId':req.params.userId
            });

    } catch (err) {
        console.log(err + "error");
    }
});

module.exports = router;