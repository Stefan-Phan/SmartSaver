const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getSavingByUserID,
  addSaving,
  updateSaving,
  deleteSaving,
} = require("../controllers/savingController");
const router = express.Router();

router.get("/", verifyToken, getSavingByUserID);
router.post("/", verifyToken, addSaving);
router.put("/:id", verifyToken, updateSaving);
router.delete("/:id", verifyToken, deleteSaving);

module.exports = router;
