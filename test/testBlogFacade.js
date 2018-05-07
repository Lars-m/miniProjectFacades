const expect = require("chai").expect;
const dbSetup = require("..//dbSetup");
var blogFacade = require("../facades/blogFacade")
var User = require("../models/user");
var LocationBlog = require("../models/locationBlog");
let userIdKurt = null;
let userIdHanne = null;
let blogId1 = null;
let blogId2 = null;
let connection = null;

describe("Testing the LocationBlog Facade", function () {

  
  /* Connect to the TEST-DATABASE */
  before(async function () {
    this.timeout(require("../dbSettings").MOCHA_TEST_TIMEOUT);
    dbSetup.setDbUri(require("../dbSettings").TEST_DB_URI);
    connection = await dbSetup.connect();
    await User.remove({});
    //await LocationBlog.remove({});
    const users = await Promise.all([
      new User({ firstName: "Kurt", lastName: "Wonnegut", userName: "kw", password: "test" }).save(),
      new User({ firstName: "Hanne", lastName: "Wonnegut", userName: "hw", password: "test" }).save(),
    ])
    userIdKurt = users[0]._id;
    userIdHanne = users[1]._id;
   
  })

  /* Setup the database in a known state (2 users) before EACH test */
  beforeEach(async function () {
    await LocationBlog.remove({});
    const blogs = await Promise.all([
      new LocationBlog({info:"Cool Place",author:userIdHanne,pos: {longitude:26,latitude:148}}).save(),
      new LocationBlog({info:"Another Cool Place",author:userIdHanne,pos: {longitude:20,latitude:100}}).save(),
    ])
    blogId1 = blogs[0]._id;
    blogId2 = blogs[1]._id;
  })
  
  it("Should add a location Blog written by Kurt",async function(){
    const b1 = await blogFacade.addLocationBlog(userIdKurt,"bla bla",10,20);
    expect(b1.author).to.be.equal(userIdKurt);
    const blogs = await LocationBlog.find({}).exec();
    expect(blogs.length).to.be.equal(3)
  })

  it("Should add the ID to the end of the slug",async function(){
    const b1 = await blogFacade.addLocationBlog(userIdKurt,"bla bla",10,20);
    expect(b1.author).to.be.equal(userIdKurt);
    const blogs = await LocationBlog.find({}).exec();
    expect(blogs[0].slug).to.be.equal("/locationblog/"+blogs[0]._id)
  })

  it("Should find the first blog ",async function(){
    const blog = await blogFacade.findBlog(blogId1);  
    expect(blog.info).to.be.equal("Cool Place");
  })
  
  it("Should find the first blog populated with author name (only) ",async function(){
    const blog = await blogFacade.findBlog(blogId1,{},{firstName:1});  
    expect(blog.info).to.be.equal("Cool Place");
    expect(blog.author.firstName).to.be.equal("Hanne");
    expect(blog.author.lastName).to.be.equal(undefined);
  })
  it("Should find two blogs written by Hanne",async function(){
    const blogs = await blogFacade.findBlogsByAuthor(userIdHanne,{},{firstName:1});  
    expect(blogs.length).to.be.equal(2);
    expect(blogs[0].author.firstName).to.be.equal("Hanne");
    expect(blogs[1].author.firstName).to.be.equal("Hanne");
  })
  
  it("Kurt should like blog1 written by Hanne",async function(){
    const blog = await blogFacade.likeBlog(blogId1,userIdKurt);
    expect(blog.likedBy.length).to.be.equal(1);
  })
 
  it("Kurt should not be allowed to like blog1 written by Hanne more than once",async function(){
    await blogFacade.likeBlog(blogId1,userIdKurt);
    try{
      await blogFacade.likeBlog(blogId1,userIdKurt);
    } catch(err){
      expect(err.message).to.be.equal("You have already liked this blog");
    }
    
  })
})