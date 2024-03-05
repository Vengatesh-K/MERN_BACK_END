const router = require("express").Router();

const Signup = require("../models/signup");

router.route("/").get((req, res) => {
  Signup.find()
    .then((users) => res.json(users))
    .catch((err) => res.json(`Error from user signup ${err}`));
});

module.exports = router;
