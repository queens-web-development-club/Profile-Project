const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  Club: {
    type: Schema.Types.ObjectId,
    ref: "clubs"
  },
  contributors: {
    type: Array
  },
  description: {
    type: String
  }
});

module.exports = Project = mongoose.model("projects", ProjectSchema);
