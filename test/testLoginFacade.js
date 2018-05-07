const expect = require("chai").expect;
const dbSetup = require("..//dbSetup");
var TEST_DB_URI = "mongodb://test:test@ds119969.mlab.com:19969/miniproject_test";
var TEST_DB_URI = "mongodb://test:test@ds119969.mlab.com:19969/miniproject_test";
var loginFacade = require("../facades/loginFacade");
var User = require("../models/user");
var Position = require("../models/position");

let connection = null;



describe("Testing the LoginFacade", function () {


  before(async function () {
    this.timeout(require("../dbSettings").MOCHA_TEST_TIMEOUT);
    dbSetup.setDbUri(require("../dbSettings").TEST_DB_URI);
    connection = await dbSetup.connect();


    await User.remove({});
    await Position.remove({});
    let userPromises = [
      new User({ firstName: "Kurt", lastName: "Wonnegut", userName: "Swimmer1", password: "test" }).save(),
      new User({ firstName: "Peter", lastName: "Hansen", userName: "Swimmer2", password: "test" }).save(),
      new User({ firstName: "Helle", lastName: "Olsen", userName: "Runner1", password: "test" }).save(),
      new User({ firstName: "Janne", lastName: "Johnson", userName: "Runner11", password: "test" }).save(),
      new User({ firstName: "Tester", lastName: "Testersen", userName: "Tester", password: "test" }).save(),
    ]

    var users = await Promise.all(userPromises);
    var posPromises = [
      new Position({ user: users[0]._id, loc: { coordinates: [12.487442, 55.773718] } }).save(),
      new Position({ user: users[1]._id, loc: { coordinates: [12.604494, 55.766214] } }).save(),
      new Position({ user: users[2]._id, loc: { coordinates: [12.502635, 55.719345] } }).save(),
      new Position({ user: users[3]._id, loc: { coordinates: [12.515734, 55.646729] } }).save(),
    ]
    await Promise.all(posPromises);
  })

  it("Should Throw with a 403 status", async function () {
    try {
      const friends = await loginFacade("Tester", "unknown password", 12.515734, 55.646729, 55);
    } catch (err) {
      expect(err.status).to.be.equal(403);
    }
  });

  it("Should allow Tester to Login", async function () {
    const friends = await loginFacade("Tester", "test", 12.515734, 55.646729, 1);
    expect(friends).not.to.equal(null);
  });

  /*
    Todo: For the following tests, setup testusers in a way so distance is calculated and KNOWN in advance
  */
  it("Should allow Tester to Login and find all four nearby friends", async function () {
    const res = await loginFacade("Tester", "test", 12.515734, 55.646729, 100);
    //console.log(res);
    expect(res.friends.length).to.be.equal(4);
  });

  it("Should allow Tester to Login and find two nearby friends", async function () {
    const res = await loginFacade("Tester", "test", 12.515734, 55.646729, 10);
    expect(res.friends.length).to.be.equal(2);
  });

  it("Should allow Tester to Login and find zero nearby friends", async function () {
    const res = await loginFacade("Tester", "test", 12.528855, 55.674865, 1);
    expect(res.friends.length).to.be.equal(0);
  });
});