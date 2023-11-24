const { buildSchema } = require("graphql");
const user = require("./userSchema.js");
const bookEntry = require("./bookEntrySchema.js");
const catalogue = require("./catalogueSchema.js");

const schema = `
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  ${user}
  ${bookEntry}
  ${catalogue}
`;

module.exports = buildSchema(schema);
