const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");

require("dotenv").config();

const auth = {
  auth: {
      api_key: process.env.API_KEY,
      domain: process.env.DOMAIN
  }
};

const transporter = nodemailer.createTransport(mailGun(auth));

activateAccountEmail = (email, id, token, cb) => {

  var mailOptions = {
      from: "mignunez@csumb.edu",
      to: email,
      subject: "Account activation",
      html: `<p>Please click on the following link, or paste it into your browser to complete the account activation process:<br><br><a href="http://www.needa.online/activate-account/${id}/${token}">http://www.needa.online/activate-account/${id}/${token}</a><br><br>The Team</p>`
  };
  transporter.sendMail(mailOptions, function(err, data) {
    if (err) cb(err, null);
    else cb(null, data);
  });
}

resetPasswordEmail = (email, id, token, cb) => {

  var mailOptions = {
      from: "mignunez@csumb.edu",
      to: email,
      subject: "Password reset",
      html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste it into your browser to complete the process within one hour of receiving it:<br><br><a href="http://www.needa.online/password-reset-update/${id}/${token}">http://www.needa.online/password-reset-update/${id}/${token}</a><br><br>If you did not request this, please ignore this email and your password will remain unchanged.<br><br>The Team</p>`
  };
  transporter.sendMail(mailOptions, function(err, data) {
    if (err) cb(err, null);
    else cb(null, data);
  });
}

contactEmail = (first_name, last_name, email, message, receiverEmail, cb) => {
  const mailOptions = {
    from: email,
    to: receiverEmail,
    subject: `Needa - ${first_name} ${last_name} just messaged you`,
    text : `${message}`
  };
  transporter.sendMail(mailOptions, function(err, data) {
    if (err) cb(err, null);
    else cb(null, data);
  });
}

module.exports = {resetPasswordEmail, activateAccountEmail, contactEmail};
