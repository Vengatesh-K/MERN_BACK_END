const router = require("express").Router();

const Crud = require("../models/crud");

router.route("/").get(async (req, res) => {
  const crudUsers = await Crud.find();

  if (crudUsers.length === 0) {
    res.status(404).json({ message: "No crud users found" });
  }

  res.status(200).json({ message: "Fetched all crud Users", data: crudUsers });
});

router.route("/add").post(async (req, res) => {
  const { name, role, experience } = req.body.data;

  const newUser = new Crud({
    name,
    role,
    experience,
  });
  newUser
    .save()
    .then(() => {
      res.status(200).json({
        message: "Crud user created successfully! 💚",
        data: newUser,
        status: "success",
      });
    })
    .catch((err) => {
      console.error("Error creating crud user:", err);
      res
        .status(500)
        .json({ message: `Error creating crud user in DB : ${err}` });
    });
});

router.route("/:id").put(async (req, res) => {
  const { name, role, experience } = req.body.data;
  const userId = req.params.id;

  const updateData = {
    name,
    role,
    experience,
  };

  try {
    const updatedUser = await Crud.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (updatedUser) {
      res.status(200).json({
        message: "Crud user update successfully! 💚",
        data: updatedUser,
        status: "success",
      });
    } else {
      res.status(404).json({ message: "crud users not updated " });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error creating crud user in DB : ${error}` });
  }
});

router.route("/:id").delete(async (req, res) => {
  const itemId = req.params.id;

  try {
    const deletedUser = await Crud.deleteOne({ _id: itemId });
    if (deletedUser.deletedCount === 1) {
      console.log(`User with ID ${itemId} deleted successfully`);

      res.status(200).json({
        message: "Crud user deleted 💚",
        itemId: deletedUser,
        status: "success",
      });
    } else {
      console.log(`No user found with ID ${itemId}`);
    }
  } catch (error) {
    console.error(`Error deleting user: ${error}`);
  }
});

module.exports = router;
