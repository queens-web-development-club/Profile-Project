const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const keys = require("../../config/keys");

const validateProfile = require("../utils/validateProfile");
// @route       /api/profile/create
// @params      users profile input
// @desc        validates input and creates the profile
// @authorized  true
// TODO: Add Passport middleware to protect route
router.post("/create", (req, res) => {
  const { isValid, errors } = validateProfile(req.body);
  if (!isValid) {
    res.status(400).json(errors);
  }

  const profileInput = {};
  profileInput.user = req.user.id;
  if (req.body.name) profileInput.name = req.body.name;
  if (req.body.username) profileInput.username = req.body.username;
  if (req.body.bio) profileInput.bio = req.body.bio;

  User.findById(profileInput.user).then(user => {
    if (user) {
      Profile.findOneAndUpdate(
        { user: profileInput.user },
        { $set: profileInput },
        { new: true }
      );
    } else {
      errors.user = "No user found";
      res.status(404).json(errors);
    }
  });
});
