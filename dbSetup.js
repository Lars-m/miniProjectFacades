var mongoose = require('mongoose');
let dbURI = require("./dbSettings").DB_URI;
let connected = false;

//Use to set an alternative connection String, for example for a test database
function setDbUri(uri) {
  dbURI = uri;
}

function connect() {
  if (!connected) {
    return mongoose.connect(dbURI);
  }
}

mongoose.connection.on('connected', function () {
  connected = true;
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});

module.exports = {
  setDbUri: setDbUri,
  connect: connect
}