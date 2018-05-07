var mongoose = require("mongoose");
var User = require("../models/user");

function getAllUsers(){
   return User.find({}).exec();
}

function addUser(firstName,lastName,userName,password){
  const user = new User({firstName,lastName,userName,password});
  return user.save();
}

function findByUsername(username){
  return User.findOne({userName:username}).exec();
}
function findById(userId){
  return User.findById(userId).exec();
}

module.exports = {
  getAllUsers: getAllUsers,
  addUser: addUser,
  findByUsername: findByUsername,
  findById: findById,
}