const { getAIRecommendation } = require("../utils/aiPromptGenerator");
const db = require("../config/db");

exports.getRecommendation = async (req, res) => {
  try {
    const { userId, question, category, amount, mode } = req.body;

    db.query(
      "SELECT WeeklyLimit FROM User Where ID = ?",
      [userId],
      (err, user) => {
        if (err) {
          console.error("Error fetching user data:", err);
          return res
            .status(500)
            .json({ success: false, error: "Database error" });
        }
        db.query(
          'SELECT SUM(Amount) as totalSpent FROM Transaction WHERE UserID = ? AND TYPE = "Expense"',
          [userId],
          (err, spentResult) => {
            if (err) {
              console.error("Error fetching spent data:", err);
              return res
                .status(500)
                .json({ success: false, error: "Database error" });
            }
            db.query(
              "SELECT CurrentAmount, SavingGoals FROM Saving WHERE UserID = ?",
              [userId],
              (err, saving) => {
                if (err) {
                  console.error("Error fetching saving data:", err);
                  return res
                    .status(500)
                    .json({ success: false, error: "Database error" });
                }
                const userData = {
                  weeklyLimit: user[0]?.WeeklyLimit || 0,
                  totalSpent: spentResult[0]?.totalSpent || 0,
                  totalSaved: saving[0]?.CurrentAmount || 0,
                  savingGoals: saving[0]?.SavingGoals || 0,
                };

                // Get AI Recommendation
                getAIRecommendation(userData, question, category, amount, mode)
                  .then((recommendation) => {
                    db.query(
                      "INSERT INTO AIRecommendation (UserID, Question, Recommendation, Category, Amount) VALUES (?, ?, ?, ?, ?)",
                      [userId, question, recommendation, category, amount],
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
              }
            );
          }
        );
      }
    );
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
      "SELECT * FROM AIRecommendation WHERE UserID = ? ORDER BY CreatedAT DESC",
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
