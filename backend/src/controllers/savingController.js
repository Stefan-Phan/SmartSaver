// const db = require("../config/db");

// exports.getSavingByUserID = (req, res) => {
//   const userID = req.userId; // Get userID from JWT
//   const sql = "SELECT * FROM Saving WHERE UserID = ?";

//   db.query(sql, [userID], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }

//     if (result.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "Saving goals not found for this user" });
//     }

//     res.json(result);
//   });
// };

// exports.addSaving = (req, res) => {
//   const userID = req.userId; // Get userID from JWT
//   const { CurrentAmount, SavingGoals, SavingGoalsFor } = req.body;
//   const sql =
//     "INSERT INTO Saving (UserID, CurrentAmount, SavingGoals, SavingGoalsFor) VALUES (?, ?, ?, ?)";

//   db.query(
//     sql,
//     [userID, CurrentAmount, SavingGoals, SavingGoalsFor],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({
//         message: "Saving goal added successfully!",
//         savingID: result.insertId,
//       });
//     }
//   );
// };

// exports.updateSaving = (req, res) => {
//   const userID = req.userId;
//   const { CurrentAmount, SavingGoals, SavingGoalsFor } = req.body;
//   const savingID = req.params.id;

//   const sql =
//     "UPDATE Saving SET UserID = ?, CurrentAmount = ?, SavingGoals = ?, SavingGoalsFor = ? WHERE ID = ?";

//   db.query(
//     sql,
//     [userID, CurrentAmount, SavingGoals, SavingGoalsFor, savingID],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err.message });
//       if (result.affectedRows === 0)
//         return res.status(404).json({ message: "Saving goal not found" });
//       res.json({ message: "Saving goal updated successfully!" });
//     }
//   );
// };

// exports.deleteSaving = (req, res) => {
//   const userID = req.userId;
//   const savingID = req.params.id;
//   const sql = "DELETE FROM Saving WHERE ID = ? AND UserID = ?";

//   db.query(sql, [savingID, userID], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (result.affectedRows === 0)
//       return res
//         .status(404)
//         .json({ message: "Saving goal not found or unauthorized" });
//     res.json({ message: "Saving goal deleted successfully" });
//   });
// };
