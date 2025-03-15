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

// Update WeeklyLimit
exports.updateWeeklyLimit = (req, res) => {
  const userIdFromToken = req.userId;
  const userIdFromParams = req.params.id;
  const { WeeklyLimit } = req.body;

  // Compare the user ID from the URL with the user ID from the token
  if (parseInt(userIdFromParams) !== parseInt(userIdFromToken)) {
    return res
      .status(403)
      .json({ message: "You are not authorized to update this user" });
  }

  const sql = "UPDATE User SET WeeklyLimit = ? WHERE ID = ?";

  db.query(sql, [WeeklyLimit, userIdFromParams], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Weekly limit updated successfully!" });
  });
};
