const router = require("express").Router();
const Signup = require("../models/signup");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(403);
  }

  if (token) {
    jwt.verify(token, process.env.NEW_ACCESS_TOKEN, (err, user) => {
      if (err) {
        return res
          .sendStatus(403)
          .json({ message: `Token was not authorized ❌` });
      }

      req.user = user;

      next();
    });
  }
};

const imageUpload = (req, res, next) => {
  const { image } = req.body.data;
  const userId = req.body.userId;
};

router.route("/").post(authenticate, async (req, res) => {
  try {
    // const contentType = req.headers["content-type"];
    // const token = req.headers["authorization"];
    // const allHeaders = req.headers;

    console.log(req.body, "bbbbbbbbbbbb");

    const { name, email, phone, currentPassword, newPassword, image } =
      req.body.data;
    // req.body.formData;
    const userId = req.body.userId;

    console.log(
      name,
      email,
      phone,
      currentPassword,
      newPassword,
      // image,
      userId,
      "************* 🌼🌼🌼🌼"
    );

    if (name === undefined || name === null || name.length === 0) {
      return res.status(404).json({ message: "Name is required ❌" });
    }
    if (email === undefined || email === null || email.length === 0) {
      return res.status(404).json({ message: "email is required ❌" });
    }
    if (phone === undefined || phone === null || phone.length === 0) {
      return res.status(404).json({ message: "Phone is required ❌" });
    }

    var isUniqueEmail = await Signup.findOne({
      email: email,
      _id: { $ne: userId },
    });

    if (isUniqueEmail != null) {
      return res.status(404).json({ message: "Email is already Exists ❌" });
    }
    var isUniquePhone = await Signup.findOne({
      phone: phone,
      _id: { $ne: userId },
    });

    if (isUniquePhone != null) {
      return res
        .status(404)
        .json({ message: "Phone number is already Exists ❌" });
    }

    var login_user = await Signup.findOne({ _id: userId });

    try {
      if (currentPassword && newPassword) {
        var invalidPassword = await bcrypt.compare(
          currentPassword,
          login_user.password
        );

        if (!invalidPassword) {
          return res.status(400).send(`Your password incorrect ❌`);
        }
        bcrypt.genSalt(7, (err, salt) => {
          bcrypt.hash(newPassword, salt, async (err, hashedPassword) => {
            var password = hashedPassword;

            const updateData = {
              name,
              email,
              phone,
              password,
              image,
            };

            try {
              const updatedUser = await Signup.findByIdAndUpdate(
                userId,
                updateData,
                { new: true }
              );

              if (!updatedUser) {
                return res.status(404).json({ message: "User not found ❌" });
              }

              res.status(200).json({
                message: "User updated successfully! 💚",
                data: updatedUser,
                status: "success",
              });
            } catch (error) {
              console.error("Error updating user:", err);
              return {
                message: `Error updating user in DB ${err}❌`,
                error: true,
              };
            }
          });
        });
      } else {
        const updateData = {
          name,
          email,
          phone,
          image,
        };

        try {
          const updatedUser = await Signup.findByIdAndUpdate(
            userId,
            updateData,
            {
              new: true,
            }
          );

          if (!updatedUser) {
            return res
              .status(404)
              .json({ message: "User not found ❌", error: true });
          }

          res.status(200).json({
            message: "User updated successfully! 💚",
            data: updatedUser,
            status: "success",
          });
        } catch (error) {
          console.error("Error updating user:", err);
          return { message: `Error updating user in DB ${err}❌`, error: true };
        }
      }
    } catch (err) {
      console.error("Error updating user:", err);
      return { message: `Error updating user in DB ${err}❌`, error: true };
    }
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: `Error creating user: ${err} ❌` });
  }
});

module.exports = router;

// Frontend (React)
const handleImageChange = (event) => {
  const newImage = event.target.files[0];
  setImageFile(newImage);

  // Send the image file to the backend using a suitable method (e.g., fetch API)
  const formData = new FormData();
  formData.append("image", newImage);

  fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle upload response (e.g., update state with the saved image path)
      setImageUrl(data.imageUrl); // Assuming the backend returns the saved image path
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
    });
};

// // Backend (Node.js with Express)
// const express = require('express');
// const multer = require('multer'); // For file upload handling

// const app = express();

// // Configure multer for file storage (replace with your desired location)
// const upload = multer({ dest: 'uploads/' });

// app.post('/api/upload-image', upload.single('image'), (req, res) => {
//   try {
//     const filePath = req.file.path; // Access the saved file path

//     // Store the filePath in your database table (replace with your setup)
//     const result = await database.query(/* SQL query to save filePath */);

//     res.json({ imageUrl: filePath }); // Send the saved file path back to the frontend
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
