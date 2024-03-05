const router = require("express").Router();

const Signup = require("../models/signup");
const bcrypt = require("bcrypt");

router.route("/").post(async (req, res) => {
  console.log(req.body.data, "request from the frontend 💚");

  try {
    const { name, email, phone, password } = req.body.data;

    bcrypt.genSalt(7, (err, salt) => {
      bcrypt.hash(password, salt, (err, hashedPassword) => {
        const password = hashedPassword;

        const newUser = new Signup({
          name,
          email,
          phone,
          password,
        });
        newUser
          .save()
          .then(() => {
            //   let signup_users = Signup.find();
            res.status(200).json({
              message: "User created successfully! 💚",
              data: newUser,
              status: "success",
            });
          })
          .catch((err) => {
            console.error("Error creating user:", err);
            res.status(500).json({ message: "Error creating user" });
          });
      });
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Error creating user" });
  }
});

module.exports = router;
