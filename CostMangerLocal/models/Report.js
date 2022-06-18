const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
    {
        date_created:{type:String, default:new Date().toLocaleDateString()} ,
        userId : {type:mongoose.Schema.Types.Number, ref:'User'},
        costs : [{type: mongoose.Schema.Types.ObjectId, ref: 'Cost'}],
        totalSum: {type:Number, default:0}, 
        
    }
    
);

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;