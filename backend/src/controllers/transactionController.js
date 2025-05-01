const db = require("../config/db");

exports.getTransactions = (req, res) => {
  const userID = req.userId;
  const sql =
    "SELECT t.*, c.Name AS CategoryName FROM Transaction t INNER JOIN Category c ON t.CategoryID = c.ID WHERE t.UserID = ?";

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
  const { Name, Amount, CategoryName } = req.body;

  if (CategoryName && CategoryName.toLowerCase() === "income") {
    const { Source = Name, Notes = "" } = req.body;
    const sql =
      "INSERT INTO Income (UserID, Source, Amount, Notes) VALUES (?, ?, ?, ?)";

    db.query(sql, [userID, Source, Math.abs(Amount), Notes], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({
        message: "Income record added successfully!",
        incomeID: result.insertId,
      });
    });
  } else {
    // Get CategoryID from CategoryName for expenses
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
        "INSERT INTO Transaction (UserID, Name, Amount, CategoryID) VALUES (?, ?, ?, ?)";

      db.query(sql, [userID, Name, Amount, CategoryID], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          message: "Transaction added successfully!",
          transactionID: result.insertId,
        });
      });
    });
  }
};

exports.updateTransaction = (req, res) => {
  const userID = req.userId;
  const { Name, Amount, CategoryName } = req.body;
  const transactionId = req.params.id;

  // Get CategoryID from CategoryName
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

    // Update the transaction with CategoryID, remove Date field
    const sql =
      "UPDATE Transaction SET Name = ?, Amount = ?, CategoryID = ? WHERE ID = ? AND UserID = ?";

    db.query(
      sql,
      [Name, Amount, CategoryID, transactionId, userID],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0)
          return res.status(404).json({ message: "Transaction not found" });
        res.json({ message: "Transaction updated successfully!" });
      }
    );
  });
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
