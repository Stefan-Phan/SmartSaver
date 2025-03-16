const db = require("../config/db");

exports.getIncomeByUserID = (req, res) => {
  const userID = req.userId; // Get userID from JWT
  const sql = "SELECT * FROM Income WHERE UserID = ?";

  db.query(sql, [userID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Income records not found for this user" });
    }

    res.json(result);
  });
};

exports.addIncome = (req, res) => {
  const userID = req.userId;
  const { Source, Amount, Notes } = req.body;
  const sql =
    "INSERT INTO Income (UserID, Source, Amount, Notes) VALUES (?, ?, ?, ?)";

  db.query(sql, [userID, Source, Amount, Notes], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "Income record added successfully!",
      incomeID: result.insertId,
    });
  });
};

exports.updateIncome = (req, res) => {
  const userID = req.userId;
  const { Source, Amount, Notes } = req.body; // Remove Date from destructuring
  const incomeID = req.params.id;

  const sql =
    "UPDATE Income SET Source = ?, Amount = ?, Notes = ? WHERE ID = ? AND UserID = ?";

  db.query(sql, [Source, Amount, Notes, incomeID, userID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Income record not found" });
    res.json({ message: "Income record updated successfully!" });
  });
};

exports.deleteIncome = (req, res) => {
  const userID = req.userId;
  const incomeID = req.params.id;
  const sql = "DELETE FROM Income WHERE ID = ? AND UserID = ?";

  db.query(sql, [incomeID, userID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ message: "Income record not found or unauthorized" });
    res.json({ message: "Income record deleted successfully" });
  });
};
