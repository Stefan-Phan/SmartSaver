const db = require("../config/db");
const { getIO } = require("../socket/socket");

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
      "SELECT ID, TotalSpent, WeeklyLimit FROM Category WHERE UserID = ? AND Name = ?";

    db.query(getCategorySQL, [userID, CategoryName], (err, categoryResult) => {
      if (err) return res.status(500).json({ error: err.message });

      if (categoryResult.length === 0) {
        return res
          .status(404)
          .json({ message: "Category not found for this user" });
      }

      const CategoryID = categoryResult[0].ID;
      const currentTotalSpent = categoryResult[0].TotalSpent || 0;
      const weeklyLimit = parseFloat(categoryResult[0].WeeklyLimit) || 0;
      const expenseAmount = Math.abs(Amount);

      const sql =
        "INSERT INTO Transaction (UserID, Name, Amount, CategoryID, Type, CreatedAt) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [
        userID,
        Name,
        expenseAmount,
        CategoryID,
        "expense",
        createdAtValue,
      ];

      db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const parsedCurrentTotal = parseFloat(currentTotalSpent) || 0;
        const parsedExpenseAmount = parseFloat(expenseAmount) || 0;
        const newTotalSpent = parsedCurrentTotal + parsedExpenseAmount;

        // Emit Socket Event If Over 50%
        if (weeklyLimit > 0) {
          const spentPercentage = (newTotalSpent / weeklyLimit) * 100;

          if (spentPercentage >= 50) {
            console.log("Sending budget alert to user:", userID);
            getIO()
              .to(userID.toString())
              .emit("budgetAlert", {
                category: CategoryName,
                spent: newTotalSpent.toFixed(2),
                limit: weeklyLimit.toFixed(2),
                percentage: Math.round(spentPercentage),
                message: `⚠️ You’ve spent $${newTotalSpent.toFixed(
                  2
                )} of your $${weeklyLimit.toFixed(
                  2
                )} weekly budget on ${CategoryName} (${Math.round(
                  spentPercentage
                )}%).`,
              });
            console.log("Budget alert sent!");
          }
        }

        const updateCategorySQL =
          "UPDATE Category SET TotalSpent = ? WHERE ID = ? AND UserID = ?";

        db.query(
          updateCategorySQL,
          [newTotalSpent, CategoryID, userID],
          (updateErr) => {
            if (updateErr) {
              console.error("Error updating TotalSpent:", updateErr);
              return res.status(500).json({
                error: "Failed to update TotalSpent for the category",
              });
            }

            res.json({
              message: "Expense added successfully, and TotalSpent updated!",
              transactionID: result.insertId,
              newTotalSpent: newTotalSpent.toFixed(2),
            });
          }
        );
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

  const getTransactionSQL = `
    SELECT t.Amount, t.Type, t.CategoryID, c.Name as CategoryName, c.TotalSpent
    FROM Transaction t
    LEFT JOIN Category c ON t.CategoryID = c.ID
    WHERE t.ID = ? AND t.UserID = ?
  `;

  db.query(getTransactionSQL, [transactionId, userID], (err, transResult) => {
    if (err) return res.status(500).json({ error: err.message });

    if (transResult.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const currentTransaction = transResult[0];
    let sql;
    let values;

    if (Type.toLowerCase() === "income") {
      if (
        currentTransaction.Type.toLowerCase() === "expense" &&
        currentTransaction.CategoryID
      ) {
        const updateCategorySQL = `
          UPDATE Category
          SET TotalSpent = TotalSpent - ?
          WHERE ID = ? AND UserID = ?
        `;

        db.query(
          updateCategorySQL,
          [currentTransaction.Amount, currentTransaction.CategoryID, userID],
          (err) => {
            if (err)
              console.error(
                "Error updating previous category TotalSpent:",
                err
              );
          }
        );
      }

      sql = `
        UPDATE Transaction
        SET Name = ?, Amount = ?, CategoryID = NULL, Type = ?
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
        return res
          .status(400)
          .json({ error: "CategoryName is required for expenses." });
      }

      const getCategorySQL = `
        SELECT
          ID, TotalSpent
        FROM
          Category
        WHERE
          UserID = ? AND Name = ?
      `;

      db.query(
        getCategorySQL,
        [userID, CategoryName],
        (err, categoryResult) => {
          if (err) return res.status(500).json({ error: err.message });

          if (categoryResult.length === 0) {
            return res
              .status(404)
              .json({ message: "Category not found for this user" });
          }

          const CategoryID = categoryResult[0].ID;
          const expenseAmount = Math.abs(Amount);

          if (
            currentTransaction.Type.toLowerCase() === "expense" &&
            currentTransaction.CategoryID &&
            currentTransaction.CategoryID !== CategoryID
          ) {
            const updateOldCategorySQL = `
            UPDATE Category
            SET TotalSpent = TotalSpent - ?
            WHERE ID = ? AND UserID = ?
          `;

            db.query(
              updateOldCategorySQL,
              [
                currentTransaction.Amount,
                currentTransaction.CategoryID,
                userID,
              ],
              (err) => {
                if (err)
                  console.error("Error updating old category TotalSpent:", err);
              }
            );
          }

          let amountDifference = expenseAmount;
          if (
            currentTransaction.Type.toLowerCase() === "expense" &&
            currentTransaction.CategoryID === CategoryID
          ) {
            amountDifference = expenseAmount - currentTransaction.Amount;
          }

          const parsedCurrentTotal =
            parseFloat(categoryResult[0].TotalSpent) || 0;
          const parsedAmountDifference = parseFloat(amountDifference) || 0;
          const updatedTotalSpent = parsedCurrentTotal + parsedAmountDifference;

          const updateNewCategorySQL = `
          UPDATE Category
          SET TotalSpent = ?
          WHERE ID = ? AND UserID = ?
        `;

          db.query(
            updateNewCategorySQL,
            [updatedTotalSpent, CategoryID, userID],
            (err) => {
              if (err)
                console.error("Error updating new category TotalSpent:", err);
            }
          );

          sql = `
          UPDATE Transaction
          SET Name = ?, Amount = ?, CategoryID = ?, Type = ?
          WHERE ID = ? AND UserID = ?
        `;
          values = [
            Name,
            expenseAmount,
            CategoryID,
            "expense",
            transactionId,
            userID,
          ];

          db.query(sql, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0)
              return res.status(404).json({ message: "Expense not found" });
            res.json({ message: "Expense updated successfully!" });
          });
        }
      );
    }
  });
};

exports.deleteTransaction = (req, res) => {
  const userID = req.userId;
  const transactionId = req.params.id;

  const getTransactionSQL = `
    SELECT Amount, Type, CategoryID 
    FROM Transaction 
    WHERE ID = ? AND UserID = ?
  `;

  db.query(getTransactionSQL, [transactionId, userID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found or unauthorized" });
    }

    const transaction = result[0];

    if (
      transaction.Type.toLowerCase() === "expense" &&
      transaction.CategoryID
    ) {
      const updateCategorySQL = `
        UPDATE Category
        SET TotalSpent = TotalSpent - ?
        WHERE ID = ? AND UserID = ?
      `;

      const amountToSubtract = parseFloat(transaction.Amount) || 0;

      db.query(
        updateCategorySQL,
        [amountToSubtract, transaction.CategoryID, userID],
        (err) => {
          if (err)
            console.error(
              "Error updating category TotalSpent on deletion:",
              err
            );
        }
      );
    }

    const sql = "DELETE FROM Transaction WHERE ID = ? AND UserID = ?";

    db.query(sql, [transactionId, userID], (err, deleteResult) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Transaction deleted successfully" });
    });
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
