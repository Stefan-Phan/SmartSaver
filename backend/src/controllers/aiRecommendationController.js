const { getAIRecommendation } = require("../utils/aiPromptGenerator");
const db = require("../config/db");

// --- Reusable Data Fetching Functions (Weekly) ---

async function fetchTotalWeeklyLimit(userId) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT SUM(WeeklyLimit) AS TotalWeeklyLimit FROM Category WHERE UserID = ?",
      [userId],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]?.TotalWeeklyLimit || 0);
        }
      }
    );
  });
}

async function fetchTotalExpenseWeekly(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT SUM(t.Amount) AS totalExpenseWeekly
      FROM Transaction t
      WHERE t.UserID = ?
        AND t.Type = 'expense'
        AND WEEK(t.CreatedAt, 1) = WEEK(CURDATE(), 1)
        AND YEAR(t.CreatedAt) = YEAR(CURDATE())
    `;
    db.query(sql, [userId], (err, expenseResult) => {
      if (err) {
        reject(err);
      } else {
        resolve(expenseResult[0]?.totalExpenseWeekly || 0);
      }
    });
  });
}

// --- Controller Logic ---

exports.getRecommendation = async (req, res) => {
  try {
    const userId = req.userId;
    const { question, mode } = req.body;

    const [weeklyLimit, totalExpenseWeekly, totalIncomeWeekly] =
      await Promise.all([
        fetchTotalWeeklyLimit(userId),
        fetchTotalExpenseWeekly(userId),
      ]);

    const userData = {
      weeklyLimit,
      totalSpent: totalExpenseWeekly,
    };

    console.log(userData);

    getAIRecommendation(userData, question, mode)
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
