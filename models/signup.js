const mongoose = require("mongoose");
const signupSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
});

const Signup = mongoose.model("signup", signupSchema);

module.exports = Signup;
