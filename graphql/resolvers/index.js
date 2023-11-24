const userResolver = require("./userResolver");
const bookEntryResolver = require("./bookEntryResolver");
const catalogueResolver = require("./catalogueResolver");

module.exports = {
  ...userResolver,
  ...bookEntryResolver,
  ...catalogueResolver,
};
