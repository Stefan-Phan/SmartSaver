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
  const userID = req.userId; // Get userID from JWT
  const { Source, Amount, Date, Notes } = req.body;
  const sql =
    "INSERT INTO Income (UserID, Source, Amount, Date, Notes) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [userID, Source, Amount, Date, Notes], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "Income record added successfully!",
      incomeID: result.insertId,
    });
  });
};

exports.updateIncome = (req, res) => {
  const userID = req.userId;
  const { Source, Amount, Date, Notes } = req.body;
  const incomeID = req.params.id;

  const sql =
    "UPDATE Income SET UserID = ?, Source = ?, Amount = ?, Date = ?, Notes = ? WHERE ID = ?";

  db.query(
    sql,
    [userID, Source, Amount, Date, Notes, incomeID],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Income record not found" });
      res.json({ message: "Income record updated successfully!" });
    }
  );
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
