const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
require("dotenv").config();

const app = express();

// Public folder
app.use(express.static('public'));

// Parse HTML
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());
app.use(session({
  secret: "SecretStringForSession",
  cookie: {maxAge: 60000},
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// Template engine
app.set("view engine", "ejs");

// ROUTES
app.use("/auth", require("./server/routes/auth"));
app.use("/", require("./server/routes/pages"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});