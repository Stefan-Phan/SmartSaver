const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getAllCategories,
  addCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", verifyToken, getAllCategories);
router.post("/", verifyToken, addCategory);
router.delete("/:id", verifyToken, deleteCategory);

module.exports = router;
