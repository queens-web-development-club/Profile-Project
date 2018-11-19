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

module.exports = {
  //emails user
  signup(body) {
    return new Promise((resolve, reject) =>{
      const {email, password } = body;
      const { isValid, errors } = validateUser(body);
      if (!isValid) {
        res.status(422).json(errors);
        resolve({msg:"okay"});
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
                    resolve({msg: "Verification email sent! Please check your spam folder."});
                  })
                  .catch((err) => {
                    reject({err: "Database error"});
                  });
              });
            });
      }
    });
  },
  //validates user

  //gets one user
  getUser(userId) {
    return new Promise((resolve, reject) => {
      User.findOne({_id: userId},{password: 0})
          .then((user) => {
            if(user){
              resolve(user);
            } else {
              reject({error: "No user found"});
            }
          })
          .catch((err) => {
            reject({error: "Database error"});
          });
    });
  },
  //get all users

  //delete user
  deleteUser(userId) {
    return new Promise((resolve, reject) =>{
      User.deleteOne({_id: userId})
          .then((user) => {
            if(user.n>0){
              resolve();
            } else {
              reject({error: "No user found"})
            };
          })
    });
  }
  //update user

}
