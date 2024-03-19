const mongoose = require("mongoose");
const signupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter a name"],
    trim: true, // Remove leading/trailing whitespace
    minlength: 3, // Enforce minimum length
    maxlength: 50, // Enforce maximum length
  },
  email: {
    type: String,
    required: [true, "please enter a email"],
    unique: true, // Ensure uniqueness
    lowercase: true, // Convert to lowercase for case-insensitive comparison
    trim: true, // Remove leading/trailing whitespace
    match: /^\w+@[a-zA-Z_\-\.]+\.[a-zA-Z]{2,4}$/, // Regular expression for basic email validation
  },
  phone: {
    type: String,
    required: [true, "please enter a phone"],
    // Add validation rules for phone number format (optional)
  },
  password: String,
  image: String,
  loginStatus: Boolean,
});

const Signup = mongoose.model("signup", signupSchema);

module.exports = Signup;
