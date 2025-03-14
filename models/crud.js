const mongoose = require("mongoose");

const crudSchema = new mongoose.Schema({
  name: String,
  role: String,
  experience: Number,
});

const Crud = mongoose.model("crud", crudSchema);

module.exports = Crud;
