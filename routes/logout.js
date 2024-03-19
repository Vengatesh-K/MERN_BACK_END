const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Signup = require("../models/signup");

router.route("/").post(async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const userId = req.body.userId;

    console.log(authHeader, "aaaaaaaaaaaaa authHeader");

    const token = authHeader?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized token" });
    }

    const decoded = jwt.verify(token, process.env.NEW_ACCESS_TOKEN);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    const status = {
      loginStatus: false,
    };

    const loginStatus = await Signup.findByIdAndUpdate(userId, status, {
      new: true,
    });

    if (!loginStatus) {
      return res.status(400).json({ message: `Login Status error ❌` });
    }

    res.status(200).json({
      message: "Logout successfully ! 👍",
      // data: updatedUser,
      status: "success",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: `Internal server error : ${error}` });
  }
});

module.exports = router;
