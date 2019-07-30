var Genre = require("../models/genre");
var Book = require("../models/book");
var async = require("async");
const validator = require("express-validator");

// Display list of all Genre.
exports.genre_list = function(_, res, next) {
  Genre.find()
    .sort([["name", "ascending"]])
    .exec((err, genre_list) => {
      if (err) {
        return next(err);
      }
      res.render("genre_list", { title: "Genre List", genre_list });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
  async.parallel(
    {
      genre: callback => {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books: callback => {
        Book.find({ genre: req.params.id }).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        var error = new Error("Genre not found");
        error.status = 404;
        return next(error);
      }
      res.render("genre_detail", {
        title: "Genre Detail",
        genre: results.genre,
        genre_books: results.genre_books
      });
    }
  );
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate that the name field is not empty.
  validator
    .body("name", "˝Genre name required")
    .isLength({ min: 1 })
    .trim(),

  // Sanitize (escape) the name field.
  validator.sanitize("name").escape(),

  //Process request after validation and sanitization
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre,
        errors: errors.array()
      });
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) {
          return next(err);
        }
        if (found_genre) {
          res.redirect(found_genre.url);
        } else {
          genre.save(err => {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);
          });
        }
      });
    }
  }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
  async.parallel(
    {
      genre: function(cb) {
        Genre.findById(req.params.id).exec(cb);
      },
      books: function(cb) {
        Book.find({ genre: req.params.id }).exec(cb);
      }
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        //No such Genre
        res.redirect("/catalog/genres");
      }
      //Succesful so render
      res.render("genre_delete", {
        title: "Delete Genre",
        genre: results.genre,
        genre_books: results.books
      });
    }
  );
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
  async.parallel(
    {
      genre: cb => {
        Genre.findById(req.params.id).exec(cb);
      },
      genre_books: cb => {
        Book.find({ author: req.params.id }).exec(cb);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.genre_books.length > 0) {
        // Genre has books. Render in same way as for GET route.
        res.render("genre_delete", {
          title: "Delete Genre",
          genre: results.genre,
          genre_books: results.books
        });
        return;
      } else {
        // Genre has no books. Delete object and redirect to the list of authors.
        Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
          if (err) {
            return next(err);
          }
          // Success - go to author list
          res.redirect("/catalog/genres");
        });
      }
    }
  );
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
  res.send("NOT IMPLEMENTED: Genre update POST");
};
