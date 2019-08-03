const User = require("../models/user");
const validator = require("express-validator");
const bcrpyt = require("bcryptjs");

//Get handler for Login
exports.user_login = (req, res) => {
  res.render("login", {
    title: "Login"
  });
};

//Get handler for registration
exports.user_register_get = (req, res) => {
  res.render("register", {
    title: "Register"
  });
};

exports.user_register_post = [
  //Validate that name is not and is alphanumeric empty
  validator
    .body("name")
    .isLength({ min: 1 })
    .withMessage("name must be specified."),

  //Valid that email exists and is valid
  validator
    .body("email")
    .isLength({ min: 1 })
    .withMessage("email must be specified.")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(email => {
      return User.findOne({ email }).then(user => {
        if (user) {
          return Promise.reject("E-mail is already in use.");
        }
      });
    }),

  //Password exists and is more than 6 characters
  validator
    .body("password")
    .exists()
    .withMessage("Password must be specified.")
    .isLength({ min: 6 })
    .withMessage("Password must be at leat 6 characters"),

  //Confirmed password exists and is the same as the ols password
  validator
    .body("password2")
    .exists()
    .withMessage("Please enter your password again")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Please enter the same password"),

  //Sanitize fields
  validator.sanitizeBody("name").escape(),
  validator.sanitizeBody("email").normalizeEmail(),
  validator.sanitizeBody("password").escape(),
  validator.sanitizeBody("password2").escape(),

  //Process request after validation and sanitisation
  (req, res, next) => {
    //Extract validation errors from request
    const errors = validator.validationResult(req);

    const { name, email, password } = req.body;
    //Create a User with the validated and sanitized data
    const user = new User({
      name,
      email,
      password
    });

    if (!errors.isEmpty()) {
      //There are errors
      res.render("register", {
        title: "Register",
        name,
        email,
        errors: errors.array()
      });
      return;
    } else {
      //Hash password
      bcrpyt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrpyt.hash(user.password, salt, (err, hash) => {
          if (err) throw err;
          //Set hashed password
          user.password = hash;
          //Save user
          user.save(err => {
            if (err) throw err;
            req.flash("success_msg", "You are now registered and can log in");
            res.redirect("/users/login");
          });
        });
      });
    }
  }
];
