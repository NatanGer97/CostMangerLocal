const User = require("../../models/User");

const users =  User.findOne({});
console.log(users)