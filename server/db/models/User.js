const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  verified: {
    type: Boolean,
    default: false
  },
  userType: {
    type: String,
    default: "general"
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = User = mongoose.model("users", UserSchema);
