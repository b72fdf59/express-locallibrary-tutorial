var express = require("express");
var router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.redirect("/catalog");
});
//Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
    user: req.user
  });
});

module.exports = router;
