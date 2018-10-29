const express = require("express");
const app = express();
const passport = require("passport");
const port = process.env.PORT || 3000;

// Define request response for root
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Passport configuration
app.use(passport.initialize());
require("./utils/passport")(passport);

// Listen!
app.listen(port, () => {
  console.log(`Profile server listening on port ${port}`);
});

module.exports = app;
