//packages
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const bCrypt = require("bcryptjs");
//helper functions
const keys = require("../strings/keys");
const sendVerificationEmail = require("../emails/sendVerificationEmail");
const validateUser = require("../utils/validateUser");
//user model
const User = require("../db/models/User");

//route accepts an email and password, saves in db and calls sendVerificationEmail
router.post("/email", (req,res)=>{
  //checks for errors in email and password
  const {email, password } = req.body;
  const { isValid, errors } = validateUser(req.body);
  //report errors
  if (!isValid) {
  res.status(422).json(errors);
  } else {
    //check if email is already in use
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        errors.email = "Email already being used";
        res.status(422).json(errors);
        console.log(errors);
      } else {
        //create new user, saves email
        const newUser = new User({
          email: email,
          password: password
        })
        //hash Password
        bCrypt.genSalt(10, (err, salt) => {
          bCrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log(err);
            newUser.password = hash
            newUser
              .save()
              .then(()=>{
                //hash email
                jwt.sign({ email: email }, keys.secretOrKey, function(err, encryptedEmail) {
                  //creates unique link with hashed email of user
                  let signUpLink = `http://localhost:3000/api/users/verify/${encryptedEmail}`
                  //arguments for mailer function
                  const data = {
                    recipient: email,
                    link: signUpLink
                  }
                  //sends email
                  sendVerificationEmail(data);
                });
                res.send("Verification email sent! Please check your spam folder.");
              });
          });
        });
      }
    });
  }
});
//validates email
router.get("/verify/:encryptedEmail", (req,res)=>{
  //decodes hashed email from link
  const email = jwt_decode(req.params.encryptedEmail);
  User.findOne({email: email.email}).then(user=>{
    //checks if email is already validated
    if(user.verified){
      res.status(400).json({error:"User has already verified account"});
    } else {
      user.verified=true;
      user.save()
          .then(()=>{
            res.status(200).json({
              success: "User verified",
              id: user._id
            });
          })
          .catch(err => {console.log(err)});
    }
  })
});
//finds user by id
router.get("/current/:userId", (req,res)=>{
  User.findOne({_id: req.params.userId}, {password: 0}).then((user) => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({error: "No user found"});
    }
  }).catch(err => {
    console.log(err);
  })
});
//deletes a user
router.put("/delete/:userId", (req,res)=>{
  User.deleteOne({_id: req.params.userId}).then((user) => {
    if (user.n>0){
      res.status(200).json({success: "User deleted"});
    } else {
        res.status(404).json({error: "No user found"});
    }
  }).catch(err => {
    console.log(err);
  })
});

module.exports = router;
