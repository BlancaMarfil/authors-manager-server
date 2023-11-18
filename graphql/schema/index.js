const { buildSchema } = require("graphql");
const user = require("./userSchema.js");

const schema = `
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  ${user}
`;

module.exports = buildSchema(schema);
