var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("Working on Page");
});

//Login Page
router.get("/login", function(req, res, next) {
  res.render("login", {
    title: "Login"
  });
});

//Registration Page
router.get("/register", function(req, res, next) {
  res.render("register", {
    title: "Register"
  });
});

module.exports = router;
