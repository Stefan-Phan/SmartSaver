const { getAIRecommendation } = require("../utils/aiPromptGenerator");
const db = require("../config/db");

exports.getRecommendation = async (req, res) => {
  try {
    const userId = req.userId;
    const { question, mode, categoryName, itemPrice } = req.body;

    // const [weeklyLimit, totalExpenseWeekly, totalIncomeWeekly] =
    //   await Promise.all([
    //     fetchTotalWeeklyLimit(userId),
    //     fetchTotalExpenseWeekly(userId),
    //   ]);

    const userData = {
      userID: userId,
      itemPrice,
      categoryName,
    };

    getAIRecommendation(userData, question, categoryName, mode)
      .then((recommendation) => {
        db.query(
          "INSERT INTO AIRecommendation (UserID, Question, Recommendation) VALUES (?, ?, ?)",
          [userId, question, recommendation],
          (err, result) => {
            if (err) {
              console.error("Error inserting recommendation:", err);
              return res
                .status(500)
                .json({ success: false, error: "Database error" });
            }
            res.json({ success: true, recommendation });
          }
        );
      })
      .catch((aiError) => {
        console.error("AI recommendation error: ", aiError);
        return res.status(500).json({
          success: false,
          error: "Failed to get recommendation",
        });
      });
  } catch (error) {
    console.error("General error: ", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to get recommendation" });
  }
};

exports.getUserRecommendationHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    db.query(
      "SELECT * FROM AIRecommendation WHERE UserID = ? ORDER BY CreatedAt DESC",
      [userId],
      (err, history) => {
        if (err) {
          console.error("Error fetching recommendation history: ", err);
          return res.status(500).json({
            success: false,
            error: "Failed to fetch recommendation history",
          });
        }
        res.json({ success: true, history });
      }
    );
  } catch (error) {
    console.error("Error fetching recommendation history: ", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch recommendation history",
    });
  }
};
