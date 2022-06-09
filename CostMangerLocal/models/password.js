const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema(
    {
        password:String
    }
    
);



const Password = mongoose.model('Password',passwordSchema);

module.exports = Password;