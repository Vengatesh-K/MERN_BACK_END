const router = require("express").Router();
const jwt = require("jsonwebtoken");

const Login = require("../models/login");
const bcrypt = require("bcrypt");
const Signup = require("../models/signup");

// const authenticate = (req, res, next) => {
//   const authHeader = req.headers["authorization"];

//   const token = authHeader && authHeader.split("")[1];

//   if (!token) return res.sendStatus(403);

//   if (token) {
//     jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
//       if (err) {
//         return res.sendStatus(403);
//       }

//       req.user = user;
//       next();
//     });
//   }
// };

router.route("/").post(async (req, res) => {
  console.log(req.body.data, "req ❄️");

  const { email, password } = req.body.data;

  var login_user = await Signup.findOne({ email: email });

  if (!login_user) {
    return res.status(400).send(`Email does not exist`);
  }

  var invalidPassword = await bcrypt.compare(password, login_user.password);

  if (!invalidPassword) {
    return res.status(400).send(`Your password incorrect. Please try again`);
  }

  //   const userEmail = req.body.data.email;
  //   const userPassword = req.body.password;
  //   const node = async () => {
  //     const user = await axois.GET(USER_API, { data: "SISI" });
  //   };

  const user = { email: email, password: password };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);

  if (!accessToken) {
    return res.status(400).send(`Token was not created. Please try again`);
  }

  res.status(200).json({
    accessToken: accessToken,
    message: "Login successfully 💚",
    status: "success",
    data: { name: login_user.name, email: login_user.email },
  });
});

module.exports = router;
