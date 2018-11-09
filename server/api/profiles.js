const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const keys = require("../../config/keys");

//Models
const Profile = require("../db/models/Profile");
const User = require("../db/models/User");

//Validators
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

  //Make sure they are a valid user
  User.findById(profileInput.user).then(user => {
    if (user) {
      //Find their profile since the user exists
      Profile.findOne({ user: profileInput.user }).then(profile => {
        if (profile) {
          //Update profile if it exists
          Profile.findOneAndUpdate(
            { user: profileInput.user },
            { $set: profileInput },
            { new: true }
          )
            .then(profile => {
              res.status(201).json(profile);
            })
            .catch(err => console.log(err));
        } else {
          //Create new profile
          new Profile(profileInput)
            .save()
            .then(profile => {
              res.status(201).json(profile);
            })
            .catch(err => console.log(err));
        }
      });
    } else {
      errors.user = "No user found";
      res.status(404).json(errors);
    }
  });
});
