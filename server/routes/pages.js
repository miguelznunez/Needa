const express = require("express");
const bcrypt = require("bcrypt");
const moment = require("moment");
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


// USER HAS ACCESS TO THESE ROUTES ANYTIME

router.get("/", authController.isLoggedIn, (req, res) => {
  if(!checkBrowser(req.headers))
    return res.render("index", {title: "Needa | Home", user : req.user} );
  else
    return res.render("unsupported", {title: "Needa | Home", user : req.user});
});

router.get("/help", authController.isLoggedIn, (req, res) => {
  if(!checkBrowser(req.headers))
    return res.render("help", { title:"Needa | Help", user:req.user} );
  else
    return res.render("unsupported", {title: "Needa | Home", user : req.user});
});

router.get("/contact", authController.isLoggedIn, (req, res) => {
  if(!checkBrowser(req.headers))
    return res.render("contact", {title: "Needa | Contact", user : req.user} );
  else
    return res.render("unsupported", {title: "Needa | Home", user : req.user});
});

router.get("/search-results-user-profile/:id", authController.isLoggedIn, (req, res) => {
  if(!checkBrowser(req.headers) && req.user){
    db.query("SELECT * FROM user WHERE id = ?", [req.params.id], (err1, result1) => {
      if(!err1) {
        db.query("SELECT u2.profile_photo, u2.id FROM user u1 LEFT JOIN following ON u1.id = following.id LEFT JOIN user u2 ON u2.id=following.following_id WHERE u1.id = ?", [req.params.id], (err2, result2) => {
          if(!err2) {
            db.query("SELECT * FROM following WHERE id = ? AND following_id = ?", [req.user.id, req.params.id], (err3, result3) => { 
              if(!err3){
                const r2 = (result2[0].id === null) ? null : result2;
                const r3 = (result3[0] === undefined) ? null : true;
                return res.render("user-profile", {title: "Needa | View User", user:req.user, rows: result1, website:cropWebURL(result1[0].website), twitter:cropSocialURL(result1[0].twitter), instagram:cropSocialURL(result1[0].instagram), facebook:cropSocialURL(result1[0].facebook), linkedin:cropSocialURL(result1[0].linkedin), tags:JSON.parse(result1[0].tags), showcasePhotos:JSON.parse(result1[0].showcase_photos), usersFollowing:r2, isFollowing:r3});
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
    db.query("SELECT * FROM user WHERE id = ?",[req.params.id], (err1, rows) => {
      if(!err1 && rows[0] !== undefined) {
        db.query("SELECT u2.profile_photo, u2.id FROM user u1 LEFT JOIN following ON u1.id = following.id LEFT JOIN user u2 ON u2.id=following.following_id WHERE u1.id = ?", [req.params.id], (err2, result2) => {
          if(!err2) {
            const r2 = (result2[0].id === null) ? null : result2;
            return res.render("user-profile", {title: "Needa | View User", rows: rows, tags:JSON.parse(rows[0].tags), showcasePhotos:JSON.parse(rows[0].showcase_photos), usersFollowing:r2, isFollowing:false })
          } else {
            return console.log(err2.message);
          }
        })
      } else if(rows[0] === undefined) {
        return res.redirect("/");
      } else { 
        return res.render("index", {title: "Needa |Login", user : req.user, type:"error", message: err1.message} );
      }
    });
  } else {
    return res.redirect("/login");
  }
});

router.get("/profile-photo/:id/:key", authController.isLoggedIn, (req, res) => {
  if(!checkBrowser(req.headers)){
    const readStream = s3.getImageStream(req.params.id, req.params.key);
    readStream.pipe(res);
  }else {
    return res.redirect("/login");
  }
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


// USER MUST NOT HAVE ACCESS TO THESE ROUTES WHEN THEY ARE LOGGED IN

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
          return res.render("password-reset-update", {title: "Needa | Password Reset Update", user : req.user, id: req.params.id, token: req.params.token, token_expires: results[0].token_expires, token_success: true} );
      } else{
        return res.render("password-reset-update", {title: "Needa | Password Link Expired", user : req.user, token_success: false, type:"error", message: "Password reset token is invalid or has expired."} );
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


// USER MUST BE LOGGED IN TO ACCESS THESE ROUTES

router.get("/dashboard", authController.isLoggedIn, (req, res) => {
  if(req.user && !checkBrowser(req.headers))
    return res.render("dashboard", {title: "Needa | Dashboard", user : req.user} );
  else
    return res.redirect("/login");
});

router.get("/profile", authController.isLoggedIn, (req, res) => {
  // If user IS logged in show the page otherwise redirect to the home page
  if(req.user && !checkBrowser(req.headers)) {
    db.query("select user.id, user.profile_photo from following join user on following.following_id = user.id where following.id = ?", [req.user.id], (err, result) => { 
      const results = (result[0] === undefined) ? null : result;
      return res.render("profile", {title: "Needa | Profile", user:req.user, website:cropWebURL(req.user.website), twitter:cropSocialURL(req.user.twitter), instagram:cropSocialURL(req.user.instagram), facebook:cropSocialURL(req.user.facebook), linkedin:cropSocialURL(req.user.linkedin), tags:JSON.parse(req.user.tags),usersFollowing:results, showcasePhotos:JSON.parse(req.user.showcase_photos)} );
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
    const showcasePhotos = JSON.parse(req.user.showcase_photos);
    return res.render("showcase", { title:"Needa | Showcase Settings", user:req.user, showcasePhotos:showcasePhotos } );
  } else { 
    return res.redirect("/login");
  }
});

router.get("/feed", authController.isLoggedIn, (req, res) => {
  if(req.user && !checkBrowser(req.headers)) {
    db.query("SELECT user.id, user.first_name, user.last_name, user.profile_photo, user.city, user.state, user.county, postings.postId, postings.date, postings.title, postings.post FROM user JOIN postings ON user.id = postings.id WHERE user.county = ? ORDER BY postings.postId", [req.user.county], (err, result) => {
      if(!err){
        let dates = [];
        result.forEach((r,i) => {
          dates.push(moment(result[i].date).fromNow())
        });
        return res.render("feed", {title: "Needa | Feed", user : req.user, rows:result, dates:dates} );
      } else {
        return res.render("feed", {title: "Needa | Feed", user : req.user, message:err.message, dates:dates} );
      }
    })
  } else {
    return res.redirect("/login");
  }
});

router.get("/add-new", authController.isLoggedIn, (req, res) => {
  if(req.user && !checkBrowser(req.headers)) {
    const flashSuccess = req.flash("success");
    const flashError = req.flash("error");
    return res.render("add-new", {title: "Needa | Add New", user : req.user, flashSuccess, flashError} );
  } else {
    return res.redirect("/login");
  }
});

router.get("/my-posts", authController.isLoggedIn, (req, res) => {
  if(req.user && !checkBrowser(req.headers)) {
    db.query("SELECT user.id, user.first_name, user.last_name, user.profile_photo, user.city, user.state, postings.postId, postings.id, postings.date, postings.title, postings.post FROM user JOIN postings ON user.id = postings.id WHERE user.id = ?", [req.user.id], (err, result) => {
      if(!err){
        let dates = [];
        result.forEach((r,i) => {
          dates.push(moment(result[i].date).fromNow())
        });
        return res.render("my-posts", {title: "Needa | My Posts", user : req.user, rows:result, dates:dates} );
      } else {
        return res.render("my-posts", {title: "Needa | My Posts", user : req.user, message:err.message, dates:dates} );
      }
    })
  } else {
    return res.redirect("/login");
  }
});

router.get("/updatePosts", async (req, res) => {
  let sql;
  let sqlParams;

  switch (req.query.action) {
   case "add": 
      let date = moment().format('YYYY-MM-DD HH:mm:ss');
      sql = "INSERT INTO postings (id, date, title, post, county) VALUES (?,?,?,?,?)";
      sqlParams = [req.query.id, date, req.query.title, req.query.message, req.query.county];
      break;
   case "edit": 
      let data = { title:req.query.title, post:req.query.message};
      sql = "UPDATE postings SET ? WHERE postId = ?";
      sqlParams = [data, req.query.postId];
      break;
   case "delete": 
      sql = "DELETE FROM postings WHERE postId = ?";
      sqlParams = [req.query.text];
      break;
   case "delete-all": 
      sql = "DELETE FROM postings WHERE id = ?";
      sqlParams = [req.query.text];
      break;
 }//switch
  let rows = await executeSQL(sql, sqlParams);
  res.send(rows.affectedRows.toString());
});

// Execute mysql query
async function executeSQL(sql, params){
 return new Promise (function (resolve, reject) {
   db.query(sql, params, function (err, rows, fields) {
     if (err) throw err;
     resolve(rows);
  });
 });
}


// USER MUST BE LOGGED IN AND BE AN ADMIN TO ACCESS THESE ROUTES

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