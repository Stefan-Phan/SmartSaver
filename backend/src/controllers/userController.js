const db = require("../config/db");

// Get all users
exports.getUsers = (req, res) => {
  db.query("SELECT * FROM User", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

exports.addUser = (req, res) => {
  const { Name, Email, WeeklyLimit } = req.body;
  const sql = "INSERT INTO User (Name, Email, WeeklyLimit) VALUES (?, ?, ?)";
  db.query(sql, [Name, Email, WeeklyLimit], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User added successfully!", userID: result.insertId });
  });
};
