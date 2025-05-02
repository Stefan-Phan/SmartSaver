const db = require("../config/db");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePasswords } = require("../utils/passwordUtils");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await hashPassword(password);

  const sql = "INSERT INTO User (Name, Email, Password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      // Handle duplicate email error
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "That email is already in use" });
      }
      return res.status(500).json({ error: "Server error: " + err.message });
    }

    res.json({ message: "User registered successfully", ID: result.insertId });
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM User WHERE Email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res
        .status(401)
        .json({ message: "We couldn't find an account with that email" });
    }

    const user = result[0];
    const passwordMatch = await comparePasswords(password, user.Password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect password. Please try again" });
    }

    const token = jwt.sign({ userId: user.ID }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.json({ token });
  });
};
