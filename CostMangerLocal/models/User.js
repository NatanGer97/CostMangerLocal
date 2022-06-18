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
        // the model holds only the reference of cost items (only the id)
        costs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Cost'}],
           
        
        
    }
    
);

userSchema.methods.ShowData = function () {
    console.log(this);
}

const User = mongoose.model('User',userSchema);

module.exports = User;