var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
require('dotenv').config()
require('./models/User');
require('./config/passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
connect()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);

module.exports = app;

function connect() {
    mongoose.connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', function(){console.log("DB Connected")});
    return mongoose.connect(process.env.MONGODB_URL, {
      keepAlive: 1,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
  }