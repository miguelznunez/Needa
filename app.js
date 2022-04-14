const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Public folder
app.use(express.static('public'));

// Parse HTML
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

// Template engine
app.set("view engine", "ejs");

// ROUTES
app.use("/auth", require("./server/routes/auth"));
app.use("/", require("./server/routes/pages"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port${PORT}`);
});