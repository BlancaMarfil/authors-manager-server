const express = require("express");
const graphqlHttp = require("express-graphql").graphqlHTTP;
const mongoose = require("mongoose");
const graphqlSchema = require("./graphql/schema");
const graphqlResolvers = require("./graphql/resolvers");

const app = express();

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);
const uri =
  "mongodb+srv://demo:node1234@cluster0.yjvuzff.mongodb.net/?retryWrites=true&w=majority";
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
  .connect(uri, options)
  .then(() => app.listen(4000, console.log("Server is running on port 4000")))
  .catch((error) => {
    throw error;
  });
