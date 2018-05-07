var express = require('express');
var router = express.Router();

const graphqlHTTP = require('express-graphql');

router.use("/",(req,res)=>{res.end("Add your GraphQL endpoint here")})
// router.use('/', graphqlHTTP({
//   schema,
//   graphiql: true
// }))

module.exports = router;
