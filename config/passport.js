var passport = require("passport");
var LocalStrategy = require("passport-local");
var mongoose = require("mongoose");
var User = mongoose.model("User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      User.findOne({ email: email })
        .then(function (user) {
          if (!user || !user.validPassword(password)) {
            return done(null, false, {
              errors: { "email or password": "is invalid." },
            });
          }
          return done(null, user);
        })
        .catch(done);
    }
  )
);

passport.serializeUser(function (user, cb) {
  console.log(user);
  cb(null, user._id);
});

passport.deserializeUser(function (_id, cb) {
  User.findById(_id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});
