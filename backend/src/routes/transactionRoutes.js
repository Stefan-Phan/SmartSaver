const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const router = express.Router();

router.get("/", verifyToken, getTransactions);
router.post("/", verifyToken, addTransaction);
router.put("/:id", verifyToken, updateTransaction);
router.delete("/:id", verifyToken, deleteTransaction);

module.exports = router;
