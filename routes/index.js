var express = require('express');
var router = express.Router();


var blogFacade = require("../facades/blogFacade");

router.get("/locationblog/:blogId",async (req,res)=>{
  console.log("ID---->",req.params.blogId)
  const blog = await blogFacade.findBlog(req.params.blogId);
  res.json(blog);
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mini Project' });
});

module.exports = router;
