const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTotalIncome,
  getTotalExpenses,
  getWeeklyReport,
  getBalance,
} = require("../controllers/transactionController");
const router = express.Router();

router.get("/", verifyToken, getTransactions);
router.get("/total-income", verifyToken, getTotalIncome);
router.get("/total-expense", verifyToken, getTotalExpenses);
router.get("/balance", verifyToken, getBalance);
router.get("/weekly-report", verifyToken, getWeeklyReport);
router.post("/", verifyToken, addTransaction);
router.put("/:id", verifyToken, updateTransaction);
router.delete("/:id", verifyToken, deleteTransaction);

module.exports = router;
