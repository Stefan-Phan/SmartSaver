const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getUsers,
  addUser,
  getOneUser,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();

router.get("/", getUsers);
router.post("/", addUser);
router.get("/:id", verifyToken, getOneUser);
router.delete("/:id", deleteUser);

module.exports = router;
