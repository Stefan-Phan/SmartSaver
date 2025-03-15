const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getIncomeByUserID,
  addIncome,
  updateIncome,
  deleteIncome,
} = require("../controllers/incomeController");
const router = express.Router();

router.get("/", verifyToken, getIncomeByUserID);
router.post("/", verifyToken, addIncome);
router.put("/:id", verifyToken, updateIncome);
router.delete("/:id", verifyToken, deleteIncome);

module.exports = router;
