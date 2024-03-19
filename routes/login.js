const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Signup = require("../models/signup");

router.route("/").post(async (req, res) => {
  console.log(req.body.data, "req ❄️");

  const { email, password } = req.body.data;

  var login_user = await Signup.findOne({ email: email });

  if (!login_user) {
    return res.status(400).json({ message: `Email does not exist ❌` });
  }

  const status = {
    loginStatus: true,
  };

  const loginStatus = await Signup.findByIdAndUpdate(login_user._id, status, {
    new: true,
  });

  console.log(
    login_user,
    "loginStatusloginStatus ==================login_user"
  );
  console.log(loginStatus, "loginStatusloginStatus");

  if (!loginStatus) {
    return res.status(400).json({ message: `Login Status error ❌` });
  }

  var invalidPassword = await bcrypt.compare(password, login_user.password);

  if (!invalidPassword) {
    return res.status(400).json({ message: `Your password incorrect ❌` });
  }

  const user = { email: email, password: password };

  const accessToken = jwt.sign(user, process.env.NEW_ACCESS_TOKEN);

  if (!accessToken) {
    return res.status(400).json({ message: `Token was not created ❌` });
  }

  res.status(200).json({
    accessToken: accessToken,
    message: "Login successfully 💚",
    status: "success",
    data: {
      userId: login_user.id,
      name: login_user.name,
      email: login_user.email,
      phone: login_user.phone,
      password: login_user.password,
      image: login_user.image,
      loginStatus: loginStatus.loginStatus,
    },
  });
});

module.exports = router;
