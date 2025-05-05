const db = require("../config/db");

// Get all categories for a user
exports.getAllCategories = (req, res) => {
  const userId = req.userId;
  const sql = "SELECT ID, Name, WeeklyLimit FROM Category WHERE UserID = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Add a new category for a user
exports.addCategory = (req, res) => {
  const userId = req.userId;
  const { Name, WeeklyLimit } = req.body;

  if (!Name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const sql =
    "INSERT INTO Category (UserID, Name, WeeklyLimit) VALUES (?, ?, ?)";
  db.query(sql, [userId, Name, WeeklyLimit], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Category added successfully", ID: result.insertId });
  });
};

exports.deleteCategory = (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  const sql = "DELETE FROM Category WHERE ID = ? AND UserID = ?";
  db.query(sql, [id, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Category not found or not owned by user" });
    }
    res.json({ message: "Category deleted successfully" });
  });
};

exports.updateCategory = (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const { Name, WeeklyLimit } = req.body;

  const sql =
    "UPDATE Category SET Name = ?, WeeklyLimit = ? WHERE ID = ? AND UserID = ?";
  db.query(sql, [Name, WeeklyLimit, id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Category not found or not owned by user" });
    }

    res.json({ message: "Category updated successfully" });
  });
};

// Get total weekly limit for a user
exports.getTotalWeeklyLimit = (req, res) => {
  const userId = req.userId;

  const sql =
    "SELECT SUM(WeeklyLimit) AS TotalWeeklyLimit FROM Category WHERE UserID = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const total = results[0].TotalWeeklyLimit || 0;
    res.json({ totalWeeklyLimit: total });
  });
};
