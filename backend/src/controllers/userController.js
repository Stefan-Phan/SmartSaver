const db = require("../config/db");

// Get all users
exports.getUsers = (req, res) => {
  db.query("SELECT * FROM User", (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
};

// Add user
exports.addUser = (req, res) => {
  const { Name, Email, WeeklyLimit, Password } = req.body;
  const sql =
    "INSERT INTO User (Name, Email, WeeklyLimit, Password) VALUES (?, ?, ?, ?)";

  db.query(sql, [Name, Email, WeeklyLimit, Password], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "User added successfully!" });
  });
};

// Get One User
exports.getOneUser = (req, res) => {
  const ID = req.params.id;
  const sql = "SELECT * FROM User WHERE ID = ?";

  db.query(sql, [ID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result[0]);
  });
};

// Delete User
exports.deleteUser = (req, res) => {
  const ID = req.params.id;
  const sql = "DELETE FROM User WHERE ID = ?";

  db.query(sql, [ID], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully " });
  });
};
