//Import Modules
var express = require("express");
var session = require("express-session");
var cookieSession = require("cookie-session");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var passport = require("passport");
require("dotenv").config();
//Models
require("./models/User");
//Passport config
require("./config/passport");
//Import routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

//Express and database
var app = express();
connect();

//Session config
const sess = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
};

app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser(process.env.SESSION_SECRET)); //CookieParser
app.use(bodyParser.urlencoded({ extended: true })); //BodyParser
app.use(session(sess));

//Passport
app.use(passport.initialize());
app.use(passport.session());
//Routes
app.use("/api/", indexRouter);
app.use("/api/users", usersRouter);

module.exports = app;

function connect() {
  mongoose.connection
    .on("error", console.log)
    .on("disconnected", connect)
    .once("open", function () {
      console.log("DB Connected");
    });
  return mongoose.connect(process.env.MONGODB_URL, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
}
