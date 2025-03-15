const express = require("express");
const {
  getRecommendation,
  getUserRecommendationHistory,
} = require("../controllers/aiRecommendationController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/recommendation", verifyToken, getRecommendation);
router.get("/history/:userId", verifyToken, getUserRecommendationHistory);

module.exports = router;
