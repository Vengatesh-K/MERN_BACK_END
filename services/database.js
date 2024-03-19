const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const usersRoutes = require("../routes/users");
const signupRoutes = require("../routes/signup");
const loginRoutes = require("../routes/login");
const updateRoutes = require("../routes/update");
const logoutRoutes = require("../routes/logout");

require("dotenv").config();

const MONGO_URI = "mongodb://localhost:27017/users";
mongoose
  .connect(MONGO_URI, {})
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", usersRoutes);
app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);
app.use("/update", updateRoutes);
app.use("/logout", logoutRoutes);

const PORT = 7000;

app.listen(PORT, () => {
  console.log(`Server port ${PORT}`);
});
