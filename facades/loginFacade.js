var mongoose = require("mongoose");
var User = require("../models/user");
var Position = require("../models/position");

//require("../dbSetup.js").connect();

function findByUsername(username){
  return User.findOne({userName:username});
}

function findFriends(point, dist){
  let query = Position.find({
    loc:
    {
      $near:{
        $geometry: point,
        $maxDistance: dist
      }
    }
  }, { _id: 0, created: 0, __v: 0 }).populate("user",{userName:1, _id:0})
  return query.exec();
}

async function login(username,password,longitude,latitude,distance){
  //console.log(username,password,longitude,latitude,distance)
  var user = await findByUsername(username);
   if(user == null || user.password !== password){
      throw {msg: "wrong username or password", status: 403} 
   }
   //If logged in update users position
   const point =  {'type': "Point", coordinates:[longitude,latitude]};
   Position.findOneAndUpdate({user:user._id},{created:Date.now(),loc:point},{new:true,upsert:true}).exec();

   //Now find his friends
   const friends = await findFriends(point,distance*1000);
   const filtered =friends.filter(friend => friend.user.userName !==username).map(friend=>{
     return {
       userName: friend.user.userName,
       latitude: friend.loc.coordinates[1],
       longitude: friend.loc.coordinates[0]
     }
   });
   return {friends: filtered};
}
module.exports = login;

// async function testLogin(){
  
//   try{
//     const friends = await login("Tester","test",12.515734, 55.646729,55);
//     console.log(friends);
//   }catch (err){
//     console.log("Upps",err);
//   }
// }
// testLogin();
