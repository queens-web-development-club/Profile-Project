const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bCrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const keys = require("../strings/keys");
const verifyEmail = require("../emails/verifyEmail")
const User = require("../db/models/User")

router.get("/test", (req,res)=>{
  res.send("test");
});

router.post("/email", (req,res)=>{
  const email = req.body.email;
  const errors = {};
  if(email.length=0){
    errors.email="Please enter an email address";
    res.status(422).json(errors);
  } else {
      //check if address is from queens
      if(false){
      //if(/^[A-Za-z0-9._%+-]+@queensu\.ca$/.test(email)){
        errors.email="Please enter a QueensU email address";
        res.status(422).json(errors);
        console.log(errors);
      } else {
        //check if email is used already
        User.findOne({ email: req.body.email }).then(user => {
          if (user) {
            errors.email = "Email already being used";
            res.status(422).json(errors);
            console.log(errors);
          } else {
            //create new user, save email
            const newUser = new User({
              email: email
            }).save()
            .then(() => {
              //hash email
              jwt.sign({ email: email }, keys.secretOrKey, function(err, encryptedEmail) {
                let signUpLink = `http://localhost:3000/api/users/verify/${encryptedEmail}`
                const data = {
                  recipient: email,
                  link: signUpLink
                }
                verifyEmail(data);
              });

            })
          }
        });
      }
    }
    res.send("Verification email sent! Please check your spam folder.");
  });

router.get("/verify/:encryptedEmail", (req,res)=>{
  const email = jwt_decode(req.params.encryptedEmail);
  User.findOne({email:email}).then(user=>{
    if(user.verified){
      res.status(400).json({error:"User has already verified account"});
    } else {
      user.verified=true;
      user.save()
          .then(()=>{
            res.status(200);
          });
    }
  })
});

router.post("/register", (req,res)=>{

});

module.exports = router;
