const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  verified: {
    type: Boolean,
    default: false
  },
  userType: {
    type: String
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  Clubs: {
    type: Array
  },
  Projects: {
    type: Array
  }
});

module.exports = User = mongoose.model("users", UserSchema);
