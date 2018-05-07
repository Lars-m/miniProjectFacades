const expect = require("chai").expect;
const dbSetup = require("..//dbSetup");
var userFacade = require("../facades/userFacade");
var User = require("../models/user");

let connection = null;
describe("Testing the User Facade", function () {

  /* Connect to the TEST-DATABASE */
  before(async function () {
    this.timeout(require("../dbSettings").MOCHA_TEST_TIMEOUT);
    dbSetup.setDbUri(require("../dbSettings").TEST_DB_URI);
    connection = await dbSetup.connect();
  })


  /* Setup the database in a known state (2 users) before EACH test */
  beforeEach(async function () {
    console.log("BeforeEach")
    await User.remove({});
    await Promise.all([
      new User({ firstName: "Kurt", lastName: "Wonnegut", userName: "kw", password: "test" }).save(),
      new User({ firstName: "Hanne", lastName: "Wonnegut", userName: "hw", password: "test" }).save(),
    ])
  })

  it("Should find all users (Kurt and Hanne)", async function () {
    var users = await userFacade.getAllUsers();
    expect(users.length).to.be.equal(2);
  });

  it("Should Find Kurt Wonnegut", async function () {
    var user = await userFacade.findByUsername("kw");
    expect(user.firstName).to.be.equal("Kurt");
  });

  it("Should add Peter Pan", async function () {
    var user = await userFacade.addUser("Peter", "Pan", "peter", "test");
    expect(user.firstName).to.be.equal("Peter");

    var users = await userFacade.getAllUsers();
    expect(users.length).to.be.equal(3);
  });

})