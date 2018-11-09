const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  bio: {
    type: String
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
