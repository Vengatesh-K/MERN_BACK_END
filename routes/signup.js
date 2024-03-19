const router = require("express").Router();
const Signup = require("../models/signup");
const bcrypt = require("bcrypt");

router.route("/").post(async (req, res) => {
  try {
    const { name, email, phone, password } = req.body.data;

    const image = "";

    const AlreadyExistEmail = await Signup.findOne({ email: email });

    if (AlreadyExistEmail && AlreadyExistEmail.email) {
      return res
        .status(404)
        .json({ message: "Email is already registered ❌" });
    }
    const AlreadyExistPhone = await Signup.findOne({ phone: phone });

    if (AlreadyExistPhone && AlreadyExistPhone.phone) {
      return res
        .status(404)
        .json({ message: "Mobile number is already registered ❌" });
    }

    bcrypt.genSalt(7, (err, salt) => {
      bcrypt.hash(password, salt, (err, hashedPassword) => {
        const password = hashedPassword;
        const newUser = new Signup({
          name,
          email,
          phone,
          password,
          image,
          loginStatus: false,
        });
        newUser
          .save()
          .then(() => {
            res.status(200).json({
              message: "User created successfully! 💚",
              data: newUser,
              status: "success",
            });
          })
          .catch((err) => {
            console.error("Error creating user:", err);
            res
              .status(500)
              .json({ message: `Error creating user in DB : ${err}` });
          });
      });
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: `Error creating user : ${err}` });
  }
});

module.exports = router;
