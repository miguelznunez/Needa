const mysql = require("mysql");
const db = require("../../db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mail = require("../../mail.js");
const {validationResult} = require("express-validator");
var randomstring = require("randomstring");
const s3 = require("../../s3.js");

const fs = require("fs");
const util = require("util");
const {promisify} = require("util");
const unlinkFile = util.promisify(fs.unlink);

require("dotenv").config();

// HELPER FUNCTIONS -----------------------------------------------

// GRAB THE CURRENT DATE
function get_date(){
  let yourDate = new Date()
  const offset = yourDate.getTimezoneOffset();
  yourDate = new Date(yourDate.getTime() - (offset*60*1000));
  return yourDate.toISOString().split('T')[0]
}

// CAPITALIZE FIRST LETTER OF STRING
function titleCase(string){
  const updatedString = (string === "") ? null : string[0].toUpperCase() + string.slice(1).toLowerCase();
  return updatedString;
}

// CAPITALIZE FIRST LETTER OF EVERY WORD STRING
function titleCaseAll(string) {
  const splitString = (string === "") ? null : string.toLowerCase().split(' ');
  if(splitString){
    for (let i = 0; i < splitString.length; i++) 
      splitString[i] = splitString[i].charAt(0).toUpperCase() + splitString[i].substring(1);   
    return splitString.join(' ');
  } 
  return splitString;   
}

// DELETE PHOTO FROM S3

async function deletePhotofromS3(user_id, photo_path){
  if(photo_path != null){
    await s3.deleteImage(user_id, photo_path);
  }
}

// PARSE TAGS

function parseTags(rawTags){
  let tags = [];

  if(rawTags !== "") {
    const values = JSON.parse(rawTags); // PARSE TAGS COMING IN FROM THE FRONT END

    for(let i = 0;i < values.length;i++) // LOOP THROUGH EACH TAG
      tags.push(values[i]["value"].toLowerCase());

    tags = JSON.stringify(tags); // STRINGIFY JSON - TO STORE IN DATABASE
    return tags;

  } else {
    return null;
  }
}

// REGISTER -------------------------------------------------------


exports.register = (req, res) => {
  const { state, zip, county, email, password, password_confirm } = req.body,
  member_since = get_date();
  let {first_name, last_name, city} = req.body;

  first_name = titleCase(first_name);
  last_name = titleCase(last_name);
  city = titleCaseAll(city);

  // GRAB ANY ERRORS FROM EXPRESS VALIDATOR
  const errors = validationResult(req),
  allErrors = JSON.stringify(errors),
  allParsedErrors = JSON.parse(allErrors);
   // OUTPUT VALIDATION ERRORS IF ANY
  if(!errors.isEmpty()){
    return res.render("register", {
      title: "Needa | Register",
      allParsedErrors: allParsedErrors,
      first_name: first_name,
      last_name: last_name,
      city: city,
      state: state,
      zip: zip,
      county: county,
      email: email,
      password : password
    })
  }

  db.query("SELECT email FROM user WHERE email = ?", [email], async (err, results) => {
    // CHECK IF EMAIL ALREADY EXISTS IN DATABASE
    if (!err && results != "") {
      return res.render("register", {title: "Needa | Register",
                              type: "error",
                              message: "An account with that email already exists",
                              first_name : first_name,
                              last_name : last_name,
                              city: city,
                              state: state,
                              zip: zip,
                              county: county,
                              email: email,
                              password: password});
    // ELSE CREATE A NEW USER
    } else if(!err && results[0] === undefined){
        const token = randomstring.generate(255);
        bcrypt.hash(password, saltRounds, (err, hash) => {
          db.query("INSERT INTO user (first_name, last_name, city, state, zip, county, email, password, token, member_since) VALUES (?,?,?,?,?,?,?,?,?,?)", [first_name, last_name, city, state, zip, county, email, hash, token, member_since],
            async (err, results) => {
              if (!err) {
                mail.activateAccountEmail(email, results.insertId, token, (err, data) => {
                  if(!err) return res.render("register", { title:"Needa | Register", type:"success", message:`We have sent an email to ${email}, please click the link included to verify your email address.` });
                  else return res.render("register", { title:"Needa | Register", type:"error", message:err.message });
                });
              // DATABASE ERROR
              } else { return res.render("register", { title:"Needa | Register", type:"error", message:err.message}); }
          })//function
        });//bcrypt
    // DATABASE ERROR
    } else{ return res.render("register", { title:"Needa | Register", type:"error", message:err.message }); } 
   });
}


// LOGIN -------------------------------------------------------


exports.login = async (req, res) => {
  const {email, password} = req.body;

  // VALIDATE THAT EMAIL AND/OR PASSWORD ARE NOT EMPTY STRINGS
  if(!email || !password){
    return res.render("login", {
      title:"Needa | Login",
      type: "error",
      message: "Please provide a username and password"
    })
  }

  db.query("SELECT * FROM user WHERE email = ?", [email], async (err, results) => {
    // IF EMAIL IS NOT IN THE DATABASE OR PASSWORDS DO NOT MATCH
    if(!err && (results == "" || !(await bcrypt.compare(password, results[0].password.toString())))){
      return res.render("login", {title:"Needa | Login", type: "error",  message: "The email or password is incorrect."});
    // ELSE IF ACCOUNT IS INACTIVE
    } else if (!err && results[0].status === "Inactive") {
      return res.render("login", {title: "Needa | Login", type: "error", message: "This account has not been verified."});
    // ELSE ALLOW USER TO LOGIN
    } else if (!err && results[0].status === "Active"){
      const id = results[0].id;
      const token = jwt.sign({ id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
      }
      res.cookie("jwt", token, cookieOptions);
      return res.redirect("/");
    // DATABASE ERROR
    } else{
      console.log("yo");
      return res.render("login", {title: "Needa | Login", type: "error", message: err.message});
    }
  });
}



// LOGOUT -------------------------------------------------------


exports.logout = async (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 2*1000),
    httpOnly: true
  });
  return res.redirect("/");
}


// UPDATE PASSWORD -------------------------------------------------------


exports.updatePassword = (req, res) => {
  const { id, token, token_expires, password } = req.body;

  // CHECK THAT TOKEN IS NOT EXPIRED
  if(token_expires > Date.now()){
    const errors = validationResult(req),
    allErrors = JSON.stringify(errors),
    allParsedErrors = JSON.parse(allErrors);
     // OUTPUT VALIDATION ERRORS IF ANY
    if(!errors.isEmpty()){
      return res.render("password-reset-update", {
        title: "Needa | Password Reset Update",
        allParsedErrors: allParsedErrors,
        token: token,
        token_expires: token_expires,
        id: id,
        token_success: true
      })
    }
    // UPDATE THE PASSWORD
    bcrypt.hash(password, saltRounds, (err, hash) => {
      const data = { token: null, token_expires: null, password: hash};
      db.query("UPDATE user SET ? WHERE id = ?", [data, id], (err, result) => {
        if(!err) return res.render("login", {title: "Needa | Login", type: "success", message: "Your new password has been saved. Please use your new credentials to login."});
        else return res.render("password-reset-update", {title: "Needa | Password Reset Update", type: "error", message: err.message});
      });
    });
  } else {
    return res.render("password-reset-update", {title: "Needa | Password Reset Update", token_success: false, message: "Password reset token is invalid or has expired" });
  }
}



// PASSWORD RESET -------------------------------------------------------


exports.passwordReset = (req, res) => {
  const email = req.body.email,
  pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
  // CHECK FOR EMAIL VALIDATION
  if(!email){
    return res.render("password-reset", { title:"Needa | Password Reset", type:"error", message:"The email field cannot be empty." })
  } else if(!pattern.test(email)){
    return res.render("password-reset", { title:"Needa | Password Reset", type:"error", message:"The email you entered is invalid." })
  }

  // CHECK IF EMAIL EXISTS  
  db.query("SELECT id, email FROM user WHERE email = ?", [email] , (err, results) => {    
    // EMAIL FOUND
    if(!err && results[0] != undefined) {
      const id = results[0].id;
      // GENERATE TOKEN 
      const token = randomstring.generate(255);
      // SET EXPIRATION DATE
      const token_expires = Date.now() + 3600000;
      const data = { token: token, token_expires: token_expires};
      // SEND USER EMAIL TO RESET PASSWORD
      db.query("UPDATE user SET ? WHERE email = ?", [data, email], (err, results) => {
        if(!err) {
          mail.resetPasswordEmail(email, id, token, (err, data) => {
            if(!err) { 
              return res.render("password-reset", { title:"Needa | Password Reset", type:"success", message:`We have sent an email to ${email}, please click the link included to reset your password.` });
            } else {
              return res.render("password-reset", { title:"Needa | Password Reset", type:"error", message:err.message });
            }
          });
        // DATABASE ERROR
        } else { 
          return res.render("password-reset", { title:"Needa | Password Reset", type:"error", message:err.message });
       }
      }); 
    // EMAIL WAS NOT FOUND (USER DOES NOT EXIST)
    } else if(!err && results[0] === undefined) {
       return res.render("password-reset", { title:"Needa | Password Reset", type:"error", message:"An account with that email address does not exist." });
    // DATABASE ERROR
    } else {
      return res.render("password-reset", { title:"Needa | Password Reset", type:"error", message:err.message });
    }
  });
}


exports.settings = async (req, res) => {

  const {profile_photo, cover_photo} = req.files,
  errors = validationResult(req),
  allErrors = JSON.stringify(errors),
  allParsedErrors = JSON.parse(allErrors);

   // OUTPUT VALIDATION ERRORS ( IF ANY )
  if(!errors.isEmpty()){
    if(typeof req.files["profile_photo"] !== "undefined")
      await unlinkFile(profile_photo[0].path);
    if(typeof req.files["cover_photo"] !== "undefined")
      await unlinkFile(cover_photo[0].path);
    const success = req.flash("success");
    const tags = JSON.parse(req.user.tags);
    return res.render("settings", {title: "Needa | Settings", allParsedErrors:allParsedErrors, user:req.user, tags:tags, success})
  }

  if(typeof req.files.profile_photo !== "undefined" && typeof req.files.cover_photo !== "undefined"){
    uploadPhotos(req.user, req, res, profile_photo[0], cover_photo[0], req.body);
  } else if(typeof req.files.profile_photo !== "undefined" && typeof req.files.cover_photo === "undefined"){
    uploadProfilePhotoOnly(req.user, req, res, profile_photo[0], req.user.cover_photo, req.body.deleteCoverPhoto, req.body);
  } else if(typeof req.files.profile_photo === "undefined" && typeof req.files.cover_photo !== "undefined"){
    uploadCoverPhotoOnly(req.user, req, res, req.user.profile_photo, cover_photo[0], req.body.deleteProfilePhoto, req.body);
  } else {
    noUploadedPhotos(req.user, req, res, req.body.deleteProfilePhoto, req.body.deleteCoverPhoto, req.body);
  }
}

// UPLOAD PROFILE AND COVER PHOTOS

async function uploadPhotos(user, req, res, profile_data, cover_data, update){
  // UPLOAD IMAGES TO S3
  await s3.uploadImage(user.id, profile_data);
  await s3.uploadImage(user.id, cover_data);
  // UNLINK FILES FROM UPLOADS FOLDER
  await unlinkFile(profile_data.path);
  await unlinkFile(cover_data.path);
  // DELETE OLD PROFILE AND COVER PHOTO FROM S3 (IF ANY)
  deletePhotofromS3(user.id, user.profile_photo);
  deletePhotofromS3(user.id, user.cover_photo)

  console.log("Uploaded profile and cover")
  databaseQuery(req, res, profile_data.filename, cover_data.filename, update, user.id);
}

// UPLOAD PROFILE PHOTO (DELETE COVER PHOTO IF NEEDED)

async function uploadProfilePhotoOnly(user, req, res, profile_data, cover_data, cover_outcome, update){
  // UPLOAD IMAGE TO S3
  await s3.uploadImage(user.id, profile_data);
  // UNLINK FILE FROM UPLOADS FOLDER
  await unlinkFile(profile_data.path);
  // DELETE OLD PROFILE PHOTO FROM S3 (IF ANY)
  deletePhotofromS3(user.id, user.profile_photo);

  if(cover_outcome === "delete" && user.cover_photo != null){
    console.log("Uploaded profile and deleted cover")
    deletePhotofromS3(user.id, user.cover_photo);
    databaseQuery(req, res, profile_data.filename, null, update, user.id);
  } else {
    console.log("Uploaded profile only")
    databaseQuery(req, res, profile_data.filename, user.cover_photo, update, user.id);
  }
  
}

// UPLOAD COVER PHOTO (DELETE PROFILE PHOTO IF NEEDED)

async function uploadCoverPhotoOnly(user, req, res, profile_data, cover_data, profile_outcome, update){
  // UPLOAD IMAGE TO S3
  await s3.uploadImage(user.id, cover_data);
  // UNLINK FILE FROM UPLOADS FOLDER
  await unlinkFile(cover_data.path);
  // DELETE OLD COVER PHOTO FROM S3 (IF ANY)
  deletePhotofromS3(user.id, user.cover_photo);

  if(profile_outcome === "delete" && user.profile_photo != null){
    console.log("Uploaded cover and deleted profile")
    deletePhotofromS3(user.id, user.profile_photo);
    databaseQuery(req, res, null, cover_data.filename, update, user.id);
  } else {
    console.log("Uploaded cover only")
    databaseQuery(req, res, user.profile_photo, cover_data.filename, update, user.id);
  }
  
}

// NO PHOTOS UPLOADED (DELETE PROFILE AND COVER PHOTOS IF NEEDED)

async function noUploadedPhotos(user, req, res, profile_outcome, cover_outcome, update){
  if(profile_outcome === "delete" && user.profile_photo != null && cover_outcome === "delete" && user.cover_photo != null){
    console.log("Profile and cover deleted")
    deletePhotofromS3(user.id, user.profile_photo);
    deletePhotofromS3(user.id, user.cover_photo);
    databaseQuery(req, res, null, null, update, user.id);
  } else if(profile_outcome === "delete" && user.profile_photo != null) {
    console.log("Profile deleted")
    deletePhotofromS3(user.id, user.profile_photo);
    databaseQuery(req, res, null, user.cover_photo, update, user.id);
  } else if(cover_outcome === "delete" && user.cover_photo != null) {
    console.log("Cover deleted")
    deletePhotofromS3(user.id, user.cover_photo);
    databaseQuery(req, res, user.profile_photo, null, update, user.id);
  } else {
    console.log("Nothing uploaded or deleted")
    databaseQuery(req, res, user.profile_photo, user.cover_photo, update, user.id);
  }
} 

// UPDATE DATABASE
function databaseQuery(req, res, profile_photo, cover_photo, update, id){

  const tags = parseTags(update.tags);
  let data = { first_name:titleCase(update.first_name), last_name:titleCase(update.last_name), profile_photo:profile_photo, cover_photo:cover_photo, city:titleCase(update.city), state:update.state, zip:update.zip, county:update.county, gender:update.gender, profession:titleCaseAll(update.profession), about:update.about, services:update.services, skills:update.skills, twitter:update.twitter, instagram:update.instagram, facebook:update.facebook, linkedin:update.linkedin, website:update.website, phone:update.phone, display_phone:update.display_phone, display_email:update.display_email, tags: tags};

  db.query("UPDATE user SET ? WHERE id = ?", [data, id], (err, results) => {
    if(!err) {
      req.flash("success", "Profile was updated successfully");
      return res.redirect("/settings");
    }
    else console.log(err.message);
  }); 
}


exports.uploadShowcasePhotos = async (req, res) => { 

  const incomingPhotos = req.files,
  incomingLength = Object.keys(req.files).length,
  storagePhotos = JSON.parse(req.user.showcase_photos),
  storageLength = (storagePhotos === null) ? null : Object.keys(storagePhotos).length,
  errors = validationResult(req),
  allErrors = JSON.stringify(errors),
  allParsedErrors = JSON.parse(allErrors);
    // OUTPUT VALIDATION ERRORS ( IF ANY )
  if(!errors.isEmpty()){
    for(let i = 0;i < incomingLength;i++){
      await unlinkFile(incomingPhotos[i].path);
    }
    return res.json({type: "Error", message: allParsedErrors.errors[0].msg}); 
  }

  if(incomingLength > 0){ // USER UPLOADED AT LEAST ONE PHOTO
    let data = {};
    for(let i = 0;i < incomingLength;i++){  // ITERATE THROUGH UPLOADED PHOTOS ARRAY
      data[`${i}`] = incomingPhotos[i].filename; // CREATE JSON OBJECT WITH PHOTO FILENAMES
      await s3.uploadImage(req.user.id, incomingPhotos[i]); // UPLOAD PHOTO TO S3 
      await unlinkFile(incomingPhotos[i].path); // REMOVE FILE FROM LOCAL FOLDER
    }
    data = JSON.stringify(data); // CONVERT TO JSON
    
    if(storageLength  !== null){  // IS THERE ANY PHOTOS IN STORAGE? IF SO, DELETE THEM EVEN IF THEY ARE THE ONES WE ARE UPLOADING AND UPLOAD THEM AGAIN ** MULTER GIVES NEW FILENAMES TO FILES SO WE CAN"T COMPARE THEM
      for(let i = 0;i < storageLength;i++) 
        deletePhotofromS3(req.user.id, storagePhotos[i]);
    }
    showcasePhotosQuery(req, res, data, "success", "Successfully updated photos."); // UPDATE THE DATABASE WITH THE NEW PHOTOS  

  } else if(incomingLength === 0 && storageLength  !== null) { // USER DELETED ALL PHOTOS
    for(let i = 0;i < storageLength ;i++) // DELETE PREVIOUS SHOWCASE PHOTOS FROM S3
      deletePhotofromS3(req.user.id, storagePhotos[i]);
      
    showcasePhotosQuery(req, res, null, "success", "Successfully deleted photos."); // SET SHOWCASE PHOTOS COLUMN TO NULL

  } else { // USER CLICKED THE UPLOAD BUTTON BUT THEY DIDN'T UPLOAD ANYTHING
    return res.json({type: "error", message: "No photos have been selected."}); 
  }
}

function showcasePhotosQuery(req, res, data, type, message){
  db.query("UPDATE user SET ? WHERE id = ?", [{showcase_photos: data}, req.user.id], (err, results) => {
    if(!err) return res.json({type: type, message: message}); 
    else console.log(err.message);
  });  
}

// IS USER LOGGED IN? -------------------------------------------------------


exports.isLoggedIn = async (req, res, next) => {
  if(req.cookies.jwt){
    try{
      //1) verify the token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      //2.) check if the user still exists
      db.query("SELECT * FROM user WHERE id = ?", [decoded.id], (err, result) => {
        if(!result){
          return next();
        }
        req.user = result[0];
        return next();
      })
    }catch(err){
      return next();
    }
  }else{ next(); }
}


// SEARCH FOR PROFESSIONALS ----------------------------------------

exports.findProfessionals = (req, res) => {
  const profession = req.body.profession;
  location = req.body.location.trim().replace(/\s+/g, '');

  if(location.includes(",")) {
    const arrLocation = location.split(',');
    queryLocation(req, res, profession, arrLocation[0], arrLocation[1], "");
  } else {
    queryLocation(req, res, profession, "", "", location);
  }
}

// FIND USERS THAT MATCH PROFESSION AND CITY/STATE OR ZIP

function queryLocation(req, res, profession, city, state, zip) {
  db.query("SELECT id, first_name, last_name, email, profile_photo, city, state, zip, profession, tags, about FROM user WHERE ((profession regexp ? || tags regexp ?) && (city = ? && state = ? || zip = ?) && (status != ?))", [profession +'?', profession + '?', city, state, zip, "Deleted"], (err, rows) => {
    if(!err) {
      const results = (rows[0] === undefined) ? null : rows;
      return res.render("search-results", {title: "Needa | Search Results" , user : req.user, rows: results, profession, city, state, zip});
    } else {
      return res.render("index", { title:"Needa | Home" , user:req.user, type:"error", message:err.message});
    }
  });
}

// ADD USER TO MY CONTACT LIST ------------------------------------------------------------

exports.addContactForm = (req, res) => {
  db.query("INSERT INTO following (id, following_id) VALUES (?,?)", [req.user.id, req.body.following_id], async (err, results) => {
    if(!err){
      return res.json({type: "success", message: "User was added to your contact list."}); 
    } else {
      return res.json({type: "error", message: err.message}); 
    }
  });
}

// DELETE USER FROM MY CONTACT LIST ------------------------------------------------------

exports.deleteContactForm = (req, res) => {
  db.query("DELETE FROM following WHERE id = ? AND following_id = ?", [req.user.id, req.body.following_id], async (err, results) => {
    if(!err){
      return res.json({type: "success", message: "User was deleted from your contact list."}); 
    } else {
      return res.json({type: "error", message: err.message}); 
    }
  });
}

// ADD POST ------------------------------------------------------------------------------
exports.post = (req, res) => {
  const date = new Date();
   db.query("INSERT INTO postings (id, date, post, county) VALUES (?,?,?,?)", [req.user.id, date, req.body.post, req.user.county], async (err, results) => {
    if(!err){
      return res.redirect("/feed"); 
    } else {
      return console.log(err.message); 
    }
  });
}

// exports.addNew = (req, res) => {
//   const {title, post} = req.body;

//   const errors = validationResult(req),
//   allErrors = JSON.stringify(errors),
//   allParsedErrors = JSON.parse(allErrors);
//    // OUTPUT VALIDATION ERRORS IF ANY
//   if(!errors.isEmpty()){
//     let err = "";
//     for(let i = 0;i < allParsedErrors.errors.length;i++){
//       err += allParsedErrors.errors[i].msg + " ";
//     }
//     req.flash("error", err);
//     return res.redirect("/add-new"); 
//   }

//   const date = new Date();
//    db.query("INSERT INTO postings (id, date, title, post, county) VALUES (?,?,?,?,?)", [req.user.id, date, title, post, req.user.county], async (err, results) => {
//     if(!err){
//       req.flash("success", "Post was added successfully.");
//       return res.redirect("/feed"); 
//     } else {
//       req.flash("error", err.message);
//       return res.redirect("/feed");
//     }
//   });
// }


// DELETE ACCOUNT ------------------------------------------------------------------------

exports.deleteAccount = (req, res) => {
  const password = req.body.password,
  showcasePhotos = JSON.parse(req.user.showcase_photos),
  showcasePhotosLength = (showcasePhotos === null) ? null : Object.keys(showcasePhotos).length;

  if(password === "" || password === null || password === undefined)
    return res.render("account", {title:"Needa | Account Settings",  user:req.user, type:"error",  message:"Input field cannot be empty."});

  // CHECK IF PASSWORDS MATCH
  db.query("SELECT password FROM user WHERE id = ?", [req.user.id], async (err, results) => {
    // IF THEY MATCH DELETE THE ACCOUNT
    if(!err && (await bcrypt.compare(password, results[0].password.toString()))){
      db.query("UPDATE user SET email = ?, status = ? WHERE id = ?;DELETE FROM following WHERE following_id = ?", [null, "Deleted", req.user.id, req.user.id], async (err, results) => {
        // IF SUCCESSFULLY DELETED USER FROM DATABASE
        if(!err) {
          // DELETE USER IMAGES FROM S3
          deletePhotofromS3(req.user.id, req.user.profile_photo);
          deletePhotofromS3(req.user.id, req.user.cover_photo);
          if(showcasePhotosLength !== null){
            for(let i = 0;i < showcasePhotosLength;i++)
              deletePhotofromS3(req.user.id, showcasePhotos[i]);
          }
          // LOG THE USER OUT
          res.cookie("jwt", "logout", {
            expires: new Date(Date.now() + 2*1000),
            httpOnly: true
          });
          res.redirect("/");
        // ELSE DATABASE ERROR
        } else{  
          return res.render("account", { title:"Needa | Account Settings",  user:req.user, type: "error",  message:err.message });
        }
       })
    // ELSE IF PASSWORDS DO NOT MATCH
    } else if(!err && !(await bcrypt.compare(password, results[0].password.toString()))) {
      return res.render("account", { title:"Needa | Account Settings",  user:req.user, type: "error",  message:"The password you entered is incorrect." });
    // ELSE DATABASE ERROR
    } else { 
      return res.render("account", { title:"Needa | Account Settings",  user:req.user, type: "error",  message:err.message });
    }
  });
}

exports.contactUser = (req, res) => {
  const {message, receiverEmail} = req.body;

  mail.contactEmail(req.user.first_name, req.user.last_name, req.user.email, message, receiverEmail, (err, data) => {
    if(!err) return res.json({success:true, message:"Your message has been sent!"});
    else return res.json({success:false, message: err.message});
  }); 
}

exports.newsletter = (req, res) => {
  const {email} = req.body;

  db.query("SELECT email FROM newsletter WHERE email = ?", [email], async (err, results) => {
    // IF EMAIL ALREADY EXISTS
    if (!err && results != "") {
      return res.json({success:false, message:"You're already subscribed to our newsletter."});
    // ELSE IF EMAIL DOES NOT EXIST
    } else if(!err && results[0] === undefined) {
      db.query("INSERT INTO newsletter (email) VALUES (?)", [email], (err, rows) => {
        if(!err) return res.json({success:true, message:"You successfully subscribed to our newsletter."});
        else return res.json({success:false, message: err.message}); 
      });
    // DB ERROR
    } else {
      return res.json({success:false, message: err.message}); 
    }
  });
}

// ADMIN CRUD SYSTEM 

// FIND USER -------------------------------------------------------

exports.findUser = (req, res) => {
  let searchTerm = req.body.search;
  db.query("SELECT * FROM user WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)", ["%" + searchTerm + "%", "%" + searchTerm + "%", "%" + searchTerm + "%"], (err, rows) => {
    if(!err) return res.render("admin", {title: "Needa | Admin" , user : req.user, rows: rows});
    else console.log(err);
  });
}

// ADD USER -------------------------------------------------------


exports.addUser = (req, res) => {

  // const { state, zip, county, email, password, password_confirm, admin} = req.body;
  const { state, zip, county, email, password, password_confirm} = req.body;
  const member_since = get_date();
  const status = "Active";
  const admin = "No";
  let {first_name, last_name, city} = req.body;

  first_name = titleCase(first_name);
  last_name = titleCase(last_name);
  city = titleCaseAll(city);

  // Use express validator to check for errors in user input
  const errors = validationResult(req);
  
  // Need to stringify and parse to access the data
  var allErrors = JSON.stringify(errors);
  var allParsedErrors = JSON.parse(allErrors);

  // If there are validation errors: return them to the user.
  if(!errors.isEmpty()){
    return res.render("add-user", { 
      title           :"Needa | Add User",
      user            : req.user,
      allParsedErrors : allParsedErrors,
      first_name      : first_name,
      last_name       : last_name,
      city            : city,
      state           : state,
      zip             : zip,
      county          : county,
      email           : email
    })
  }

  // If there isn't any validation errors: check if the email is already is in use
  db.query("SELECT * FROM user WHERE email = ?", [email], async (err, results) => {
    // Technical error
    if (err) {
      console.log(err);
    // Email already exists
    } else if (results != ""){
      return res.render("add-user", {title: "Needa | Add User",
                              user        : req.user,
                              type        : "error",
                              message     : "An account with that email already exists",
                              first_name  : first_name,
                              last_name   : last_name,
                              city        : city,
                              state       : state,
                              zip         : zip,
                              county      : county,
                              email       : email });
    // Create account
    } else {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        db.query("INSERT INTO user (first_name, last_name, city, state, zip, county, email, password, member_since, status, admin) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [first_name, last_name, city, state, zip, county, email, hash, member_since, status, admin],
          async (err, results) => {
            if (!err) return res.render("add-user", {title: "Add User", user:req.user, type:"success", message:`A user account with an email of ${email} was created successfully.`});
            else console.log(err)
        })// db function
      });//bcrypt
    }
  })
}


// UPDATE USER -------------------------------------------------------


exports.updateUser = (req, res) => {
  const { first_name, last_name, admin } = req.body;
  var email = req.body.email;
  if(email === "@")
    email = undefined;

  db.query("UPDATE user SET first_name = ?, last_name = ?, email = ?, admin = ? WHERE id = ?", [first_name, last_name, email, admin, req.params.id],
    async (err, results) => {
      if (!err) {
        db.query("SELECT * FROM user WHERE id = ?",[req.params.id], (err, rows) => {
          if(!err) return res.render("edit-user", {title: "Needa | Edit User", user : req.user, success: true, message: "User has been updated", rows: rows});
          else console.log(err);
        });
      } else {
        console.log(err);
      }
  })// db function
}