const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  User: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  bio: {
    type: String
  },
  username: {
    type: String,
    required: true
  },
  Clubs: {
    type: Array,
    default: []
  },
  Projects: {
    type: Array,
    default: []
  }
});

module.exports = Profile = mongoose.model("profiles", ProfileSchema);
