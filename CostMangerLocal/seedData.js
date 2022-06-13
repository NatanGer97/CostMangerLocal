const mongoose = require('mongoose');
const Category = require('./models/Category');

const User = require("./models/User");
const Password = require("./models/password");
mongoose.connect('mongodb://localhost/CostMangerLocal')
.then(() => {console.log("Mongo Connected (open)");})
.catch(err => {
    console.log("An Error was accrued");
    console.log(err);
});

const seed_categories = [{password:'food'},{password:'health'},{name:'hosing'},{name:'sport'},{name:'education'}]
Category.insertMany(seed_categories)
.then(res => {console.log(res);})
.catch(err => {console.log(err);})

/* const seed_users = [
    {
        first_name: "Natan",
        last_name: "Gershbein",
        birthday: "08/03/1997",
        marital_status: "Single"
    },
    {
        first_name: "Avi",
        last_name: "Levi",
        birthday: "01/01/1993",
        marital_status: "Married"
    }
];
User.insertMany(seed_users)
.then(res => {console.log(res);})
.catch(err => {console.log(err);}); */
/* seed_user.save(function(error){
    if(error){
        console.log(error);
    }
    else {
        console.log("user was saved to DB");
        seed_user.ShowData();
    }
}); */

var test = "!."