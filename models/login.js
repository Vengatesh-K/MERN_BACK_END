const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  email: String,
  password: String,
  loginStatus: Boolean,
});

const Login = mongoose.model("login", loginSchema);

module.exports = Login;
