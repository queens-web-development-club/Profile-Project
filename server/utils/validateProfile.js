const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegister(data) {
  const errors = {};

  data.name = isEmpty(data.name) ? "" : data.name;
  data.bio = isEmpty(data.bio) ? "" : data.bio;
  data.username = isEmpty(data.username) ? "" : data.username;

  if (Validator.isEmpty(data.name)) {
    errors.name = "Your name is required";
  } else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Your name must be between 2 and 30 characters.";
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = "Your username is required";
  } else if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = "Your username must be between 2 and 30 characters.";
  }

  if (data.bio.length > 300) {
    errors.bio = "Your bio cannot be more than 300 characters.";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
