const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../../db.js");
const s3 = require("../../s3.js");
const authController = require("../controllers/authController");
const { query } = require("express");

const router = express.Router();

// HELPER FUNCTIONS ==================================================================

function cropSocialURL(URL){
  const cleanURL = (URL === null) ? null : URL.split(".com")[1];
  return cleanURL;
}

function cropWebURL(URL){
  const cleanURL = (URL === null) ? null : URL.split("https:/")[1];
  return cleanURL;
}

// FUNCTION TO CHECK FOR INTERNET EXPLORER ============================================

function checkBrowser(headers){
  var ba = ["Chrome","Firefox","Safari","Opera","MSIE","Trident", "Edge"];
  var b, ua = headers['user-agent'];
  for(var i=0; i < ba.length;i++){
    if(ua.indexOf(ba[i]) > -1){
      b = ba[i];
      break;
    }
  }
  // IF INTERNET EXPLORER IS BEING USED RETURN TRUE OTHERWISE RETURN FALSE
  if(b === "MSIE" || b === "Trident") return true;
  else return false
}

// GET ROUTES ==============================================================

router.get("/", authController.isLoggedIn, (req, res) => {
  if(!checkBrowser(req.headers))
    return res.render("index", {title: "Needa | Home", user : req.user} );
  else
    return res.render("unsupported", {title: "Needa | Home", user : req.user});
});

router.get("/register", authController.isLoggedIn, (req, res) => {
  // If user IS NOT logged in show the page otherwise redirect to the home page
  if(!req.user && !checkBrowser(req.headers))
    res.render("register", {title: "Needa | Register", user : req.user});
  else
    res.redirect("/");
});

router.get("/login", authController.isLoggedIn, (req, res) => {
  if(!req.user && !checkBrowser(req.headers))
    return res.render("login", {title: "Needa | Login", user : req.user });
  else
    return res.redirect("/");
});

router.get("/password-reset", authController.isLoggedIn, (req, res) => {
  if(!req.user && !checkBrowser(req.headers))
    return res.render("password-reset", {title: "Needa | Password Reset", user : req.user} );
  else
    return res.redirect("/");
});

router.get("/activate-account/:id/:token", authController.isLoggedIn, async (req, res) => {
  if(!req.user && !checkBrowser(req.headers)){
    // Check that the user exists
    db.query("SELECT * FROM user WHERE id = ?", [req.params.id], async (err, results) => { 
      if((results != "") && (results[0].token != null)) {
        if( req.params.token === results[0].token.toString()) {
          db.query("UPDATE user SET token = ?, status = ? WHERE id = ?", [null, "Active", results[0].id],
          async (err, result) => {
            if(!err) return res.render("login", {title: "Needa | Login", user : req.user, type:"success", message: "Your account has been successfully verified."} );
            else return res.render("login", {title: "Needa |Login", user : req.user, type:"error", message: err.message} );
          });
        } else {
           return res.render("login", {title: "Needa |Login", user : req.user, type:"error", message: "Authentication token is invalid or has expired."} );
        }
      } else{
        return res.render("login", {title: "Needa | Login", user : req.user,  type:"info", message: "Your account is already active, please login."} );
      } 
    });
  // Log the user out for security reasons
  } else{
    res.cookie("jwt", "logout", {
      expires: new Date(Date.now() + 2*1000),
      httpOnly: true
    });
    return res.redirect("/login");
  } 
});

router.get("/password-reset-update/:id/:token", authController.isLoggedIn, async (req, res) => {
  if(!req.user && !checkBrowser(req.headers)){
    db.query("SELECT * FROM user WHERE id = ?", [req.params.id], async (err, results) => { 
      if((results != "") && (results[0].token != null) && (results[0].token_expires > Date.now()) ) {
        if (req.params.token === results[0].token.toString() )
          return res.render("password-reset-update", {title: "Needa |  Password Reset Update", user : req.user, id: req.params.id, token: req.params.token, token_expires: results[0].token_expires, token_success: true} );
      } else{
        return res.render("password-reset-update", {title: "Needa |  Password Link Expired", user : req.user, token_success: false, type:"error", message: "Password reset token is invalid or has expired."} );
      } 
    });
  // Log the user out for security reasons
  } else{
    res.cookie("jwt", "logout", {
      expires: new Date(Date.now() + 2*1000),
      httpOnly: true
    });
    return res.redirect("/");
  }
});

// USER MUST BE LOGGED IN TO USE THESE ROUTES

router.get("/profile", authController.isLoggedIn, (req, res) => {
  // If user IS logged in show the page otherwise redirect to the home page
  if(req.user && !checkBrowser(req.headers)) {
    db.query("select user.id, user.profile_photo from following join user on following.following_id = user.id where following.id = ?", [req.user.id], (err, result) => { 
      const results = (result[0] === undefined) ? null : result;
      return res.render("profile", {title: "Needa | Profile", user:req.user, website:cropWebURL(req.user.website), twitter:cropSocialURL(req.user.twitter), instagram:cropSocialURL(req.user.instagram), facebook:cropSocialURL(req.user.facebook), linkedin:cropSocialURL(req.user.linkedin), tags:JSON.parse(req.user.tags),following:results, showcasePhotos:JSON.parse(req.user.showcase_photos)} );
    });
  } else {
    return res.redirect("/login");
  }
});

router.get("/settings", authController.isLoggedIn, (req, res) => {
  // If user IS logged in show the page otherwise redirect to the home page
  if(req.user && !checkBrowser(req.headers)) {
    const success = req.flash("success");
    return res.render("settings", {title: "Needa | Settings", user : req.user, tags: JSON.parse(req.user.tags), success} );
  }
  else 
    return res.redirect("/login");
});

router.get("/settings/account", authController.isLoggedIn, (req, res) => {
  // If user IS logged in show the page otherwise redirect to the home page
  if(req.user && !checkBrowser(req.headers)) 
    return res.render("account", {title: "Needa | Account Settings", user : req.user} );
  else 
    return res.redirect("/login");
});

router.get("/settings/showcase", authController.isLoggedIn, (req, res) => {
  // If user IS logged in show the page otherwise redirect to the home page
  if(req.user && !checkBrowser(req.headers)) {
    const showcasePhotos = JSON.parse(req.user.showcase_photos),
    length = (showcasePhotos === null) ? null : Object.keys(showcasePhotos).length;
    return res.render("showcase", {title: "Needa | Showcase Settings", user : req.user, showcasePhotos:showcasePhotos, length:length } );
  } else { 
    return res.redirect("/login");
  }
});



function queryUserInfo(userId){
  db.query("SELECT * FROM user WHERE id = ?", [userId], (err, result) => {
    if(!err && result[0] !== undefined)
      return result[0];
    else if(rows[0] === undefined)
      return res.redirect("/");
    else
      return res.render("index", {title: "Needa |Login", user : req.user, type:"error", message: err.message} )
  })
}

function queryFollowingInfo(userId){
  db.query("SELECT u2.profile_photo, u2.id FROM user u1 LEFT JOIN following ON u1.id = following.id LEFT JOIN user u2 ON u2.id=following.following_id WHERE u1.id = ?", [userId], (err, result) => {
    if(!err)
      return result[0];
    else
      return console.log(err.message);
  })
}

function queryIsFollowing(loggedInUserId, userId){
  db.query("SELECT * FROM following WHERE id = ? && following_id = ?", [loggedInUserId, userId], (err, result) => { 
    if(!err)
      return result[0];
    else
      return console.log(err.message);
  });
}

router.get("/search-results-user-profile/:id", authController.isLoggedIn, (req, res) => {
  if(!checkBrowser(req.headers) && req.user){

    db.query("SELECT * FROM user WHERE id = ?", [req.params.id], (err1, result1) => {
      if(!err1) {
        db.query("SELECT u2.profile_photo, u2.id FROM user u1 LEFT JOIN following ON u1.id = following.id LEFT JOIN user u2 ON u2.id=following.following_id WHERE u1.id = ?", [req.params.id], (err2, result2) => {
          if(!err2) {
            db.query("SELECT * FROM following WHERE id = ? && following_id = ?", [req.user.id, req.params.id], (err3, result3) => { 
              if(!err3){
                const r2 = (result2[0].id === null) ? null : result2;
                console.log(r2);
                return res.render("user-profile", {title: "Needa | View User", user:req.user, rows: result1, website:cropWebURL(result1[0].website), twitter:cropSocialURL(result1[0].twitter), instagram:cropSocialURL(result1[0].instagram), facebook:cropSocialURL(result1[0].facebook), linkedin:cropSocialURL(result1[0].linkedin), tags:JSON.parse(result1[0].tags), showcasePhotos:JSON.parse(result1[0].showcase_photos), following: r2, ifollowing:true});
              } else {
                return console.log(err3.message);
              }
           });
          } else {
            return console.log(err2.message);
          }
        })
      } else {
        return console.log(err1.message);
      } 
    })
  } else if(!checkBrowser(req.headers) && !req.user) {
    db.query("SELECT * FROM user WHERE id = ?",[req.params.id], (err, rows) => {
      if(!err && rows[0] !== undefined) {
        return res.render("user-profile", {title: "Needa | View User", rows: rows, tags:JSON.parse(rows[0].tags), showcasePhotos:JSON.parse(rows[0].showcase_photos) })
      } else if(rows[0] === undefined) {
        return res.redirect("/");
      } else { 
        return res.render("index", {title: "Needa |Login", user : req.user, type:"error", message: err.message} );
      }
    });
  } else {
    return res.redirect("/login");
  }
});

// PHOTO ROUTES

router.get("/profile-photo/:id/:key", authController.isLoggedIn, (req, res) => {
  if(!checkBrowser(req.headers)){
    const readStream = s3.getImageStream(req.params.id, req.params.key);
    readStream.pipe(res);
  }else 
    return res.redirect("/login");
});

router.get("/cover-photo/:id/:key", authController.isLoggedIn, (req, res) => {
  if(!checkBrowser(req.headers)){
    const readStream = s3.getImageStream(req.params.id, req.params.key);
    readStream.pipe(res);
  }else 
    return res.redirect("/login");
});

router.get("/showcase-photo/:id/:key", authController.isLoggedIn, (req, res) => {
  if(!checkBrowser(req.headers)){
    const readStream = s3.getImageStream(req.params.id, req.params.key);
    readStream.pipe(res);
  }else 
    return res.redirect("/login");
});

router.get("/user-photo/:id/:key", (req, res) => {
  if(!checkBrowser(req.headers)){
    const readStream = s3.getImageStream(req.params.id, req.params.key);
    readStream.pipe(res);
  }else 
    return res.redirect("/login");
});


// ADMIN CRUD SYSTEM =======================================================================

// USER MUST BE LOGGED IN AND BE AN ADMIN TO USE THESE ROUTES

router.get("/admin", authController.isLoggedIn, (req, res) => {
  if(req.user.admin === "Yes" && !checkBrowser(req.headers)) {
    db.query("SELECT * FROM user WHERE status != 'Deleted'", (err, rows) => {
      if(!err) return res.render("admin", {title: "Needa | Admin" , user : req.user, rows: rows});
      else console.log(err);
    });
  }
  else return res.redirect("/login");
});

router.get("/add-user", authController.isLoggedIn, (req, res) => {
  if(req.user.admin === "Yes" && !checkBrowser(req.headers))
    return res.render("add-user", {title : "Needa | Add User", user : req.user } );
  else 
    return res.redirect("/login");
});

router.get("/edit-user/:id", authController.isLoggedIn, (req, res) => {
  if(req.user.admin === "Yes" && !checkBrowser(req.headers)) {
    db.query("SELECT * FROM user WHERE id = ?",[req.params.id], (err, rows) => {
      if(!err) return res.render("edit-user", {title: "Needa | Edit User" , user : req.user, rows: rows});
      else console.log(err);
    });
  }
  else res.redirect("/login");
});

router.get("/view-user/:id", authController.isLoggedIn, (req, res) => {
  if(req.user.admin === "Yes" && !checkBrowser(req.headers)){
    db.query("SELECT * FROM user WHERE id = ?",[req.params.id], (err, rows) => {
      if(!err) return res.render("view-user", {title: "Needa | View User" , user : req.user, rows: rows})
      else console.log(err);
    });
  }
  else return res.redirect("/login");
});

router.get("/del-user/:id", authController.isLoggedIn, (req, res) => {
  if(req.user.admin === "Yes" && !checkBrowser(req.headers)) {
    db.query("UPDATE user SET email = ?, status = ? WHERE id = ?", [null, "Deleted", req.params.id], (err, rows) => {
      if(!err) return res.redirect("/admin");
      else console.log(err);
    });
  }
  else return res.redirect("/login");
});

router.get("*", authController.isLoggedIn, (req, res) => {
  // Output error page if route does not exists
  return res.render("error", {title: "Error 404 ", user : req.user, type: "error", message: "The page you are looking for does not exist."});
});

module.exports = router;