const db = require("../config/db");

// Get all categories for a user
exports.getAllCategories = (req, res) => {
  const userId = req.userId; // Extract user ID from token
  const sql = "SELECT * FROM Category WHERE UserID = ?";
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
  const { Name } = req.body;

  if (!Name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const sql = "INSERT INTO Category (UserID, Name) VALUES (?, ?)";
  db.query(sql, [userId, Name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Category added successfully", ID: result.insertId });
  });
};

// Delete a category by ID for the logged-in user
exports.deleteCategory = (req, res) => {
  const userId = req.userId; // Extract user ID from token
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
