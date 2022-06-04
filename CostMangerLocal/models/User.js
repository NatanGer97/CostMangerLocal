const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        
        first_name: String,
        last_name: String,
        birthday:{type:String,default:new Date().toLocaleDateString()},
        marital_status: String,
        _id: Number,
        costs: []
    }
    
);

userSchema.methods.ShowData = function () {
    console.log(this);
}

const User = mongoose.model('User',userSchema);

module.exports = User;