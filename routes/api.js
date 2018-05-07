var express = require('express');
var router = express.Router();
var login = require("../facades/loginFacade");

/* GET users listing. */
router.post('/login', async function(req, res, next) {
  const data = req.body;
  console.log(data);
  try{
    const friends = await login(data.username,data.password,data.longitude,data.latitude,data.distance);
    console.log("FRIENDS",friends);
    res.json(friends)
  }catch(err){
    console.log("UPPPPPPPPPPPPP",err);
    res.status(403);
    res.json(err);
  }
});

module.exports = router;
