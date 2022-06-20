const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {        
        first_name: String,
        last_name: String,
        birthday:{type:String,default:new Date().toLocaleDateString()},
        marital_status: String,
        _id: Number,
        password: {type: String},
        userName: {type: String},        
        costs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Cost'}],
    });
    

const User = mongoose.model('User',userSchema);

module.exports = User;