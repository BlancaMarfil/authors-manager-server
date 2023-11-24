const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: {
    type: String,
    default: uuidv4().slice(0, 8), // Generate a random ID using uuidv4
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  token: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
