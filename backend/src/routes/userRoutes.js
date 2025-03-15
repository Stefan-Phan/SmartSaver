const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getUsers,
  addUser,
  getOneUser,
  deleteUser,
  updateWeeklyLimit,
} = require("../controllers/userController");
const router = express.Router();

router.get("/", getUsers);
router.post("/", addUser);
router.get("/:id", getOneUser);
router.delete("/:id", deleteUser);
router.put("/:id/weeklyLimit", verifyToken, updateWeeklyLimit);

module.exports = router;
