const mongoose = require('mongoose')
// mongoose.connect(connectionURI);
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/CostMangerLocal');

const Password = require("./models/password");
mongoose.connect('mongodb://localhost/CostMangerLocal')
.then(() => {console.log("Mongo Connected (open)");})
.catch(err => {
    console.log("An Error was accrued");
    console.log(err);
});




const password = 'Natan';
let hashedPassword;
const newPassword = new Password({password:password});
// newPassword.save();
// bcrypt.genSalt(10, function(error,salt){
//     bcrypt.hash(password, salt,function(error,hash){
//         const pass = new Password({password:hash});
//         pass.save();
//         console.log(hashedPassword);
//     });
// } );


bcrypt.compare(password, '$2a$10$G5aglApcHQyYJBiYRqVUt.iV4m5a/RuffocO83v9C9NANlsTktFkq', function(err, result) {
    console.log(result);
});