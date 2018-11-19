const Validator = require("validator");
const isEmpty = require("./is-empty");
const mongoose = require("mongoose");
const User = require("../db/models/User");

module.exports =  function validateUser(data) {
  const errors = {};

    data.email = isEmpty(data.email) ? "" : data.email;
    data.password = isEmpty(data.password) ? "" : data.password;

  //Email
  if (Validator.isEmpty(data.password)) {
    errors.email = "Please enter an email address";
  } else {
    if(Validator.isEmail(data.email)) {
      if(data.email.split("@")[1]!="queensu.ca"){
        errors.email = "Please enter a valid QueensU email address"
      }
    }
  }

  //Email in use
  User.findOne({ email: data.email })
      .then((user) => {
        if(user) errors.email = "Email already in use";
      })
      .catch((err) => {
        console.log(err);
      })

  //Passwords
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  } else {
    if (!Validator.isLength(data.password, { min: 8, max: 40 })) {
      errors.password = "Password must be between 8 and 40 characters";
    } else if (Validator.isAlpha(data.password)) {
      errors.password = "Password must contain both numbers and letters";
    } else if (!Validator.isAlphanumeric(data.password)) {
      errors.password = "Password may only contain numbers and letters";
    }
  }

  console.log(errors)
  //returns
  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
