const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const Login = mongoose.model("login", loginSchema);

module.exports = Login;
