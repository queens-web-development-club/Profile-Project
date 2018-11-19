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
//controllers
const ctr = require("../controllers/user_controller");

//route accepts an email and password, saves in db and calls sendVerificationEmail
router.post("/email", (req,res)=>{
  ctr
    .signup(req.body)
    .then((msg)=>{
      res.status(200).json(msg);
    })
    .catch((err)=>{
      res.status(400).json(err);
    })
});
//validates email
router.post("/verify/:encryptedEmail", (req,res)=>{
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
router.get("/:userId", (req,res)=>{
  ctr
    .getUser(req.params.userId)
    .then((user)=>{
      res.status(200).json(user);
    })
    .catch((err)=>{
      res.status(400).json(err);
    });
});
//deletes a user
router.delete("/:userId", (req,res)=>{
  ctr
    .deleteUser(req.params.userId)
    .then(() => {
      res.status(200);
    })
    .catch((err) => {
      res.status(404).json(err);
    })
});

module.exports = router;
