const { getAIRecommendation } = require("../utils/aiPromptGenerator");
const db = require("../config/db");

exports.getRecommendation = async (req, res) => {
  try {
    const userId = req.userId;
    const { question, mode } = req.body;

    // Fetch user's weekly limit
    db.query(
      "SELECT WeeklyLimit FROM User WHERE ID = ?",
      [userId],
      (err, user) => {
        if (err) {
          console.error("Error fetching user data:", err);
          return res
            .status(500)
            .json({ success: false, error: "Database error" });
        }

        // Calculate total spend for 'Expense' category (excluding 'Saving' category)
        db.query(
          "SELECT SUM(t.Amount) as totalSpent FROM Transaction t " +
            "JOIN Category c ON t.CategoryID = c.ID " +
            "WHERE t.UserID = ? AND c.Name != 'Saving'",
          [userId],
          (err, spentResult) => {
            if (err) {
              console.error("Error fetching spent data:", err);
              return res
                .status(500)
                .json({ success: false, error: "Database error" });
            }

            // Fetch total income
            db.query(
              "SELECT SUM(i.Amount) AS totalIncome FROM Income i WHERE i.UserID = ?",
              [userId],
              (err, incomeResult) => {
                if (err) {
                  console.error("Error fetching income data:", err);
                  return res
                    .status(500)
                    .json({ success: false, error: "Database error" });
                }

                // Prepare user data
                const userData = {
                  weeklyLimit: user[0]?.WeeklyLimit || 0,
                  totalSpent: spentResult[0]?.totalSpent || 0,
                  totalIncome: incomeResult[0]?.totalIncome || 0,
                };

                console.log(userData);

                // Get AI recommendation
                getAIRecommendation(userData, question, mode)
                  .then((recommendation) => {
                    // Insert recommendation into the AIRecommendation table
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
                        // Send response with recommendation
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

    // Fetch recommendation history
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
