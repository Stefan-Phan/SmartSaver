const db = require("../config/db");

exports.getTransactions = (req, res) => {
  const userID = req.userId;
  const sql =
    "SELECT t.*, c.Name AS CategoryName FROM Transaction t LEFT JOIN Category c ON t.CategoryID = c.ID WHERE t.UserID = ? ORDER BY t.CreatedAt DESC";

  db.query(sql, [userID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found for this user" });
    }

    res.json(result);
  });
};

exports.addTransaction = (req, res) => {
  const userID = req.userId;
  const { Name, Amount, CategoryName, Type, CreatedAt } = req.body;

  if (!Type) {
    return res
      .status(400)
      .json({ error: "Transaction Type ('income' or 'expense') is required." });
  }

  const type = Type.toLowerCase();

  if (type !== "income" && type !== "expense") {
    return res
      .status(400)
      .json({ error: "Transaction type either is income or expense" });
  }

  let createdAtValue;
  if (CreatedAt) {
    createdAtValue = `${CreatedAt} 00:00:00`;
  } else {
    createdAtValue = null;
  }

  if (type === "income") {
    const sql = `INSERT INTO Transaction(UserID, Name, Amount, Type, CreatedAt) VALUES (?, ?, ?, ?, ?)`;
    const values = [userID, Name, Math.abs(Amount), "income", createdAtValue];

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({
        message: "Income record added successfully!",
        incomeID: result.insertId,
      });
    });
  } else {
    if (!CategoryName) {
      return res
        .status(400)
        .json({ error: "CategoryName is required for expenses." });
    }

    const getCategorySQL =
      "SELECT ID FROM Category WHERE UserID = ? AND Name = ?";

    db.query(getCategorySQL, [userID, CategoryName], (err, categoryResult) => {
      if (err) return res.status(500).json({ error: err.message });

      if (categoryResult.length === 0) {
        return res
          .status(404)
          .json({ message: "Category not found for this user" });
      }

      const CategoryID = categoryResult[0].ID;
      const sql =
        "INSERT INTO Transaction (UserID, Name, Amount, CategoryID, Type, CreatedAt) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [
        userID,
        Name,
        Amount,
        CategoryID,
        "expense",
        createdAtValue,
      ];

      db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          message: "Expense added successfully!",
          transactionID: result.insertId,
        });
      });
    });
  }
};

exports.updateTransaction = (req, res) => {
  const userID = req.userId;
  const transactionId = req.params.id;
  const { Name, Amount, CategoryName, Type } = req.body;

  if (
    !Type ||
    (Type.toLowerCase() !== "income" && Type.toLowerCase() !== "expense")
  ) {
    return res
      .status(400)
      .json({ error: "Transaction Type ('income' or 'expense') is required." });
  }

  let sql;
  let values;

  if (Type.toLowerCase() === "income") {
    sql = `
    UPDATE Transaction
    SET Name = ?, Amount = ?, Type = ?
    WHERE ID = ? AND UserID = ?
  `;

    values = [Name, Math.abs(Amount), "income", transactionId, userID];

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Income record not found" });
      res.json({ message: "Income record updated successfully!" });
    });
  } else {
    if (!CategoryName) {
      if (!CategoryName) {
        return res
          .status(400)
          .json({ error: "CategoryName is required for expenses." });
      }
    }

    const getCategorySQL = `
      SELECT
        ID
      FROM
        Category
      WHERE
        UserID = ? AND Name = ?
    `;

    db.query(getCategorySQL, [userID, CategoryName], (err, categoryResult) => {
      if (err) return res.status(500).json({ error: err.message });

      if (categoryResult.length === 0) {
        return res
          .status(404)
          .json({ message: "Category not found for this user" });
      }

      const CategoryID = categoryResult[0].ID;
      sql = `
        UPDATE Transaction
        SET Name = ?, Amount = ?, CategoryID = ?, Type = ?
        WHERE ID = ? AND UserID = ?
      `;
      values = [Name, Amount, CategoryID, "expense", transactionId, userID];

      db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0)
          return res.status(404).json({ message: "Expense not found" });
        res.json({ message: "Expense updated successfully!" });
      });
    });
  }
};

exports.deleteTransaction = (req, res) => {
  const userID = req.userId;
  const transactionId = req.params.id;

  const sql = "DELETE FROM Transaction WHERE ID = ? AND UserID = ?";

  db.query(sql, [transactionId, userID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ message: "Transaction not found or unauthorized" });
    res.json({ message: "Transaction deleted successfully" });
  });
};

exports.getTotalIncome = (req, res) => {
  const userID = req.userId;
  const sql = `
    SELECT SUM(Amount) AS TotalIncome
    FROM Transaction
    WHERE UserID = ? AND Type = 'income'
  `;
  db.query(sql, [userID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result[0] ? result[0].TotalIncome : 0);
  });
};

exports.getTotalExpenses = (req, res) => {
  const userID = req.userId;
  const sql = `
    SELECT SUM(Amount) AS TotalExpenses
    FROM Transaction
    WHERE UserID = ? AND Type = 'expense'
  `;
  db.query(sql, [userID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result[0] ? result[0].TotalExpenses : 0);
  });
};

exports.getBalance = (req, res) => {
  const userID = req.userId;
  const sql = `
    SELECT
        (SELECT SUM(Amount) FROM Transaction WHERE UserID = ? AND Type = 'income') -
        (SELECT SUM(Amount) FROM Transaction WHERE UserID = ? AND Type = 'expense') AS Balance;
  `;
  db.query(sql, [userID, userID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result[0] ? result[0].Balance : 0);
  });
};

exports.getWeeklyReport = (req, res) => {
  const userID = req.userId;

  // SQL query to get weekly transaction summaries
  const sql = `
    SELECT 
      YEAR(CreatedAt) AS Year,
      WEEK(CreatedAt) AS WeekNumber,
      DATE_FORMAT(MIN(CreatedAt), '%Y-%m-%d') AS WeekStart,
      DATE_FORMAT(MAX(CreatedAt), '%Y-%m-%d') AS WeekEnd,
      SUM(CASE WHEN Type = 'income' THEN Amount ELSE 0 END) AS TotalIncome,
      SUM(CASE WHEN Type = 'expense' THEN Amount ELSE 0 END) AS TotalExpense,
      SUM(CASE WHEN Type = 'income' THEN Amount ELSE -Amount END) AS WeeklyBalance
    FROM 
      Transaction
    WHERE 
      UserID = ?
    GROUP BY 
      YEAR(CreatedAt), WEEK(CreatedAt)
    ORDER BY 
      Year DESC, WeekNumber DESC
    LIMIT 10
  `;

  db.query(sql, [userID], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No transaction data found for this user" });
    }

    // Format the response
    const weeklyReports = results.map((week) => ({
      weekPeriod: `${week.WeekStart} to ${week.WeekEnd}`,
      year: week.Year,
      weekNumber: week.WeekNumber,
      totalIncome: parseFloat(week.TotalIncome) || 0,
      totalExpense: parseFloat(week.TotalExpense) || 0,
      weeklyBalance: parseFloat(week.WeeklyBalance) || 0,
    }));

    res.json(weeklyReports);
  });
};
