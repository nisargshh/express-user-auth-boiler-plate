//Include
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWS_SECRET;

const saltRounds = 15;

//User Schema
var UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "cannot be empty"],
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "cannot be empty"],
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      allowNull: false,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

//Set Password Method
UserSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, saltRounds)
};

//Compare Passwords
UserSchema.methods.validPassword = function(password){
    console.log("testing")
    return bcrypt.compareSync(password, this.password); // true
};

//Generate a JSON Web Token that expires in 60 days
UserSchema.methods.generateJWT = function(){
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate()+60);
    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime()/1000)
    }, secret)
};

//Return all the user information in JSON format as well as the json token
UserSchema.methods.toAuthJSON = function(){
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT()
    };
};

mongoose.model('User', UserSchema);

