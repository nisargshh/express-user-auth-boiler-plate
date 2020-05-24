var mongoose = require("mongoose");
var router = require("express").Router();
var auth = require("./auth");
var User = mongoose.model("User");
var passport = require("passport");

router.post("/", function (req, res, next) {
  var user = new User();
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);
  user
    .save()
    .then(function () {
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

router.post("/login", function (req, res, next) {
  if (!req.body.email) {
    return res.status(422).json({ errors: { email: "can't be blank." } });
  }
  if (!req.body.password) {
    return res.status(422).json({ errors: { password: "can't be blank." } });
  }

  passport.authenticate("local", { failureRedirect: "/login" }, function (
    err,
    user
  ) {
    if (err) {
      return next(err);
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.json({ user: user.toAuthJSON() });
    });
  })(req, res, next);
});

router.get("/test", function (req, res) {
  console.log("testing");
  console.log(req.user);
  return res.json(req.user);
});

router.get("/", auth.required, function (req, res, next) {
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

router.put("/", auth.required, function (req, res, next) {
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }
      if (typeof req.body.user.username !== "undefined") {
        user.username = req.body.user.username;
      }
      if (typeof req.body.user.email !== "undefined") {
        user.email = req.body.user.email;
      }
      if (typeof req.body.user.password !== "undefined") {
        user.setPassword(req.body.user.password);
      }
      return user.save().then(function () {
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});

router.use(function (err, req, res, next) {
  if (err.name === "ValidationError") {
    return res.json({
      errors: Object.keys(err.errors).reduce(function (errors, key) {
        errors[key] = err.errors[key].message;
        return errors;
      }, {}),
    });
  }
  return next(err);
});

// router.get(
//   "/twitch/callback",
//   passport.authenticate("twitch", { failureRedirect: "/" }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect("/");
//   }
// );
module.exports = router;
