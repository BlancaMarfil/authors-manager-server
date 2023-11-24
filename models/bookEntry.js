const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;

const bookEntrySchema = new Schema({
  bookEntryId: {
    type: String,
    default: uuidv4().slice(0, 10), // Generate a random ID using uuidv4
    unique: true,
  },

  bookId: {
    type: String,
    required: true,
  },

  dateRead: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("BookEntry", bookEntrySchema);
