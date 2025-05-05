const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getAllCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  getTotalWeeklyLimit,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", verifyToken, getAllCategories);
router.post("/", verifyToken, addCategory);
router.delete("/:id", verifyToken, deleteCategory);
router.put("/:id", verifyToken, updateCategory);
router.get("/total-weekly-limit", verifyToken, getTotalWeeklyLimit);

module.exports = router;
