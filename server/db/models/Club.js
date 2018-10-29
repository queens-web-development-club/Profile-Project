const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClubSchema = new Schema({
  execs: {
    type: Array,
    default: [],
    required: true
  },
  members: {
    type: Array,
    default: [],
    require: true
  },
  projects: {
    type: Array,
    default: []
  },
  description: {
    type: String
  }
});

module.exports = User = mongoose.model("users", UserSchema);
