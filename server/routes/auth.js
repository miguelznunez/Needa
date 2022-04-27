const express = require("express");
const authController = require("../controllers/authController");
const {check} = require("express-validator");
const multer  = require('multer');
const upload = multer({ 
  dest: "uploads/"
}).fields([{name: "profile_photo"}, {name: "cover_photo"}, {name: "photo_0"}]);

const router = express.Router();

// POST ROUTES  ============================================================

router.post("/register",
[
  check("first_name", "First name field cannot be empty.").not().isEmpty(),
  check("first_name", "First name must be less than 30 characters long.").isLength({min:0, max:30}),
  check("last_name", "Last name field cannot be empty.").not().isEmpty(),
  check("last_name", "Last name must be less than 30 characters long.").isLength({min:0, max:30}), 
  check("email", "The email you entered is invalid, please try again.").isEmail().normalizeEmail(),
  check("email", "Email address must be between 4-100 characters long, please try again.").isLength({min:4, max:100}).normalizeEmail(),
  check("password_confirm", "Password confirm field cannot be empty.").not().isEmpty(), 
  check("password", "Password must be between 8-60 characters long.").isLength({min:8, max:60}),
  check("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  check("password", "Password don't match, please try again.").custom(( value, { req, res, next } ) => {
  if (value !== req.body.password_confirm) {
    throw new Error("Passwords don't match, please try again.");
  }else{
    return value;
  }
 })
], authController.register);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.post("/update-password",
[ 
  check("password_confirm", "Password confirm field cannot be empty.").not().isEmpty(),
  check("password", "Password must be between 8-60 characters long.").isLength({min:8, max:60}),
  check("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  check("password", "Password don't match, please try again.").custom(( value, { req, res, next } ) => {
  if (value !== req.body.password_confirm) {
    throw new Error("Passwords don't match, please try again.");
  }else{
    return value;
  }
 })
], authController.updatePassword);

router.post("/password-reset", authController.passwordReset);

router.post("/settings",
  upload,
  [ 
  check("first_name", "First name must be 30 characters max.").isLength({max:30}),
  check("last_name", "Last name must be 30 characters max.").isLength({max:30}),
  check("city", "City must be 60 characters max.").isLength({max:60}),
  check("state", "State must be 2 characters max.").isLength({max:2}),
  check("gender", "Gender must be 2 characters max.").isLength({max:2}),
  check("profession", "Profession must be 50 characters max.").isLength({max:50}),
  check("specialty", "Specialty must be 140 characters max.").isLength({max:140}),
  check("about", "About must be 1000 characters max.").isLength({max:1000}),
  check("skills", "Skills must be 1000 characters max.").isLength({max:1000}),
  check("twitter_profile", "Twitter profile must be 255 characters max.").isLength({max:255}),
  check("instagram_profile", "Instagram profile must be 255 characters max.").isLength({max:255}),
  check("facebook_profile", "Facebook profile must be 255 characters max.").isLength({max:255}),
  check("linkedin_url", "LinkedIn URL must be 255 characters max.").isLength({max:255}),
  check("website_url", "Website URL must be 255 characters max.").isLength({max:255}),
  check("phone_number", "Phone number must be 11 characters max.").isLength({max:11}),
  check("profile_photo").custom((value, {req}) => {
    if(typeof req.files["profile_photo"] !== "undefined"){
      if(req.files["profile_photo"][0].originalname.match(/\.(png|PNG|jpeg|JPEG|jpg|JPG)$/)){
        return true;
      } else { throw new Error("Profile photo must be PNG, JPG, or JPEG")}
    } else { return true; }
  }),
  check("profile_photo").custom((value, {req}) => {
    if(typeof req.files["profile_photo"] !== "undefined"){
      if(req.files["profile_photo"][0].size < 1000000){
        return true;
      } else { throw new Error("Profile photo exceeds limit of 1MB") }
    }else {return true}
  }),
  check("cover_photo").custom((value, {req}) => {
    if(typeof req.files["cover_photo"] !== "undefined"){
      if(req.files["cover_photo"][0].originalname.match(/\.(png|PNG|jpeg|JPEG|jpg|JPG)$/)){
        return true;
      } else { throw new Error("Cover photo must be PNG, JPG, or JPEG")}
    } else { return true; }
  }),
  check("cover_photo").custom((value, {req}) => {
    if(typeof req.files["cover_photo"] !== "undefined"){
      if(req.files["cover_photo"][0].size < 1000000){
        return true;
      } else { throw new Error("Cover photo exceeds limit of 1MB") }
    }else {return true}
  })
], authController.isLoggedIn, authController.settings);

router.post("/find-user", authController.isLoggedIn, authController.findUser);

router.post("/add-user", [
  check("first_name", "First name field cannot be empty.").not().isEmpty(),
  check("first_name", "First name must be less than 25 characters long.").isLength({min:0, max:25}),
  check("last_name", "Last name field cannot be empty.").not().isEmpty(),
  check("last_name", "Last name must be less than 25 characters long.").isLength({min:0, max:25}), 
  check("email", "The email you entered is invalid, please try again.").isEmail().normalizeEmail(),
  check("email", "Email address must be between 4-100 characters long, please try again.").isLength({min:4, max:100}).normalizeEmail(),
  check("password_confirm", "Password confirm field cannot be empty.").not().isEmpty(), 
  check("password", "Password must be between 8-60 characters long.").isLength({min:8, max:60}),
  check("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  check("password", "Password don't match, please try again.").custom(( value, { req, res, next } ) => {
  if (value !== req.body.password_confirm) {
    throw new Error("Passwords don't match, please try again.");
  }else{
    return value;
  }
 })

], authController.isLoggedIn, authController.addUser);

router.post("/update-user/:id", authController.isLoggedIn, authController.updateUser);

module.exports = router;