const express = require("express");
const app = express();
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const keys = require("./strings/keys");

//Connect to MLabs Database
mongoose
  .connect(
    keys.databaseURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected."))
  .catch(err => console.log(err));

//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Passport configuration
app.use(passport.initialize());
require("./utils/passport")(passport);

//API routes

// Listen!
app.listen(port, () => {
  console.log(`Profile server listening on port ${port}`);
});

module.exports = app;
