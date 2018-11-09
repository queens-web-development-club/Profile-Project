const nodemailer = require('nodemailer');
const keys = require("../strings/keys");

module.exports = function verifyEmail(data) {
  //create email settings
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: keys.email.user,
      pass: keys.email.pass
    }
  });
  const mailOptions = {
    //setup email
    from: 'noreply.profileproject@gmail.com',
    to: data.recipient,
    subject: 'Please verify your account',
    html: '<p>Click this link to verify:</p><br><a href="'+data.link+'">click me!</a>'
  }
  //send email
  transporter.sendMail(mailOptions, function (err, info) {
   if(err)
     console.log(err)
   else
     console.log(info);
   });
}
