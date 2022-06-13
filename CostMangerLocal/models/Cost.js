const mongoose = require('mongoose');

const costSchema = new mongoose.Schema(
    {
        sum: Number,
        description: String,
        date:{type:String, default:new Date().toISOString()},
        /* category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'} */ // need to delete
        category: {type: String, default: 'General'},
        userId: {type: mongoose.Schema.Types.Number, ref: 'User', required: 'need to be assign to specif user'}
        
    }
);

const Cost = mongoose.model("Cost",costSchema);

module.exports = Cost;