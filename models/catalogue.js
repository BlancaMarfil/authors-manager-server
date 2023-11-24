const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const catalogueSchema = new Schema({
  userId: {
    type: String,
    unique: true,
  },

  authors: {
    type: [String],
    default: [],
  },

  bookEntries: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Catalogue", catalogueSchema);
