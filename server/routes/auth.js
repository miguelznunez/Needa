const express = require("express");
const authController = require("../controllers/authController");
const {check} = require("express-validator");
const multer  = require('multer');
const upload = multer({ 
  dest: "uploads/"
}).fields([{name: "profile_photo"}, 
           {name: "cover_photo"}]);

const showcaseUpload = multer({ 
  dest: "uploads/"
}).any();

const router = express.Router();

// POST ROUTES  ============================================================

router.post("/register",
[
  check("first_name", "First name field cannot be empty.").not().isEmpty(),
  check("first_name", "First name must be only alphabetical characters.").isAlpha(),
  check("first_name", "First name must be between 1 - 30 characters.").isLength({min:1, max:30}),
  check("last_name", "Last name field cannot be empty.").not().isEmpty(),
  check("last_name", "Last name must be only alphabetical characters.").isAlpha(),
  check("last_name", "Last name must be less than 30 characters long.").isLength({min:1, max:30}),
  check("city", "City must be only alphabetical characters.").matches(/^[a-zA-Z][a-zA-Z\s]*$/),
  check("city", "City must be 60 characters max.").isLength({max:60}),
  check("state", "State must be 2 characters max.").isLength({max:2}),
  check("zip", "Zip code must be 5 characters max.").isLength({max:5}),
  check("zip", "Zip code must be valid.").isPostalCode("US"),
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
  check("first_name", "First name field cannot be empty.").not().isEmpty(),
  check("first_name", "First name must be between 1 - 30 characters.").isLength({min:1, max:30}),
  check("first_name", "First name must be only alphabetical characters.").isAlpha(),
  check("last_name", "Last name field cannot be empty.").not().isEmpty(),
  check("last_name", "Last name must be between 1 - 30 characters.").isLength({min:1, max:30}),
  check("last_name", "Last name must be only alphabetical characters.").isAlpha(),
  check("city", "City must be only alphabetical characters.").matches(/^[a-zA-Z][a-zA-Z\s]*$/).optional({checkFalsy: true}),
  check("city", "City must be 60 characters max.").isLength({max:60}),
  check("state", "State must be 2 characters max.").isLength({max:2}),
  check("zip", "Zip code must be 5 characters max.").isLength({max:5}),
  check("zip", "Zip code must be valid.").isPostalCode("US").optional({checkFalsy: true}),
  check("gender", "Gender must be 2 characters max.").isLength({max:2}),
  check("profession", "Profession must be 50 characters max.").isLength({max:50}),
  check("profession", "Profession must be only alphabetical characters.").isAlpha('en-US', {ignore: ' '}).optional({checkFalsy: true}),
  check("about", "About must be 255 characters max.").isLength({max:255}),
  check("services", "Services must be 1000 characters max.").isLength({max:1000}),
  check("skills", "Skills must be 1000 characters max.").isLength({max:1000}),
  check("website", "Website URL must be 255 characters max.").isLength({max:255}),
  check("website", "Website URL must be valid.").isURL().optional({checkFalsy: true}),
  check("twitter", "Twitter profile must be 255 characters max.").isLength({max:255}),
  check("twitter", "Twitter URL must be valid.").matches(/^(http(s)?:\/\/)?(www\.)?twitter\.com\/[A-z0-9_]{4,15}\/?$/).optional({checkFalsy: true}),
  check("instagram", "Instagram profile must be 255 characters max.").isLength({max:255}),
  check("instagram", "Instagram URL must be valid.").matches(/^(http(s)?:\/\/)?(www\.)?instagram\.com\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)\/?$/).optional({checkFalsy: true}),
  check("facebook", "Facebook profile must be 255 characters max.").isLength({max:255}),
  check("facebook", "Facebook URL must be valid.").matches(/^(http(s)?:\/\/)?(www\.)?facebook\.com\/[A-z0-9_.]{5,50}\/?$/).optional({checkFalsy: true}),
  check("linkedin", "LinkedIn URL must be 255 characters max.").isLength({max:255}),
  check("linkedin", "LinkedIn URL must be valid.").matches(/^(http(s)?:\/\/)?(www\.)?linkedin\.com\/(in|profile|pub)\/([A-z0-9_-]+)\/?$/).optional({checkFalsy: true}),
  check("phone", "Phone number must be 12 characters max.").isLength({max:12}),
  check("phone", "Phone number must be valid.").isMobilePhone("en-US").optional({checkFalsy: true}),
  check("profile_photo").custom((value, {req}) => {
    if(typeof req.files["profile_photo"] !== "undefined"){
      if(req.files["profile_photo"][0].originalname.match(/\.(png|PNG|jpeg|JPEG|jpg|JPG)$/)){
        return true;
      } else { throw new Error("Profile photo must be PNG, JPG, or JPEG.")}
    } else { return true; }
  }),
  check("profile_photo").custom((value, {req}) => {
    if(typeof req.files["profile_photo"] !== "undefined"){
      if(req.files["profile_photo"][0].size < 1000000){
        return true;
      } else { throw new Error("Profile photo exceeds limit of 1MB.") }
    }else {return true}
  }),
  check("cover_photo").custom((value, {req}) => {
    if(typeof req.files["cover_photo"] !== "undefined"){
      if(req.files["cover_photo"][0].originalname.match(/\.(png|PNG|jpeg|JPEG|jpg|JPG)$/)){
        return true;
      } else { throw new Error("Cover photo must be PNG, JPG, or JPEG.")}
    } else { return true; }
  }),
  check("cover_photo").custom((value, {req}) => {
    if(typeof req.files["cover_photo"] !== "undefined"){
      if(req.files["cover_photo"][0].size < 1000000){
        return true;
      } else { throw new Error("Cover photo exceeds limit of 1MB.") }
    }else {return true}
  })
], authController.isLoggedIn, authController.settings);

router.post("/upload-showcase-photos", showcaseUpload,
check("showcase_photos").custom((value, {req}) => {
  req.files.forEach(f => {
    if(f.size > 1000000){
      throw new Error("1 or more photos exceeds the limit of 1MB.")
    } 
  }); 
  return true;
}), authController.isLoggedIn, authController.uploadShowcasePhotos);

router.post("/find-user", authController.isLoggedIn, authController.findUser);

router.post("/add-user", [
  check("first_name", "First name field cannot be empty.").not().isEmpty(),
  check("first_name", "First name must be only alphabetical characters.").isAlpha(),
  check("first_name", "First name must be between 1 - 30 characters.").isLength({min:1, max:30}),
  check("last_name", "Last name field cannot be empty.").not().isEmpty(),
  check("last_name", "Last name must be only alphabetical characters.").isAlpha(),
  check("last_name", "Last name must be less than 30 characters long.").isLength({min:1, max:30}),
  check("city", "City must be only alphabetical characters.").matches(/^[a-zA-Z][a-zA-Z\s]*$/),
  check("city", "City must be 60 characters max.").isLength({max:60}),
  check("state", "State must be 2 characters max.").isLength({max:2}),
  check("zip", "Zip code must be 5 characters max.").isLength({max:5}),
  check("zip", "Zip code must be valid.").isPostalCode("US"),
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

router.post("/find-professionals", authController.isLoggedIn, authController.findProfessionals);

router.post("/add-contact-form", authController.isLoggedIn, authController.addContactForm);

router.post("/delete-contact-form", authController.isLoggedIn, authController.deleteContactForm);

router.post("/delete-account", authController.isLoggedIn, authController.deleteAccount);

router.post("/post", authController.isLoggedIn, authController.post);

router.post("/add-new", 
[
  check("title", "Title field cannot be empty.").not().isEmpty(),
  check("title", "Title must be between 1 - 100 characters.").isLength({min:1, max:100}),
  check("post", "Post field cannot be empty.").not().isEmpty(),
  check("post", "Post must be between 1 - 1000 characters.").isLength({min:1, max:1000})
], authController.isLoggedIn, authController.addNew);

router.post("/contact-user", authController.isLoggedIn, authController.contactUser);

router.post("/newsletter", authController.isLoggedIn, authController.newsletter);

module.exports = router;