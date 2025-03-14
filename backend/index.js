const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./src/config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/smartsaver-api/v1/auth", require("./src/routes/authRoutes"));
app.use("/smartsaver-api/v1/users", require("./src/routes/userRoutes"));
// app.use("/smartsaver-api/v1/savings", require("./src/routes/savingRoutes"));
app.use("/smartsaver-api/v1/api/ai", require("./src/routes/aiRecommendation"));
app.use(
  "/smartsaver-api/v1/transaction",
  require("./src/routes/transactionRoutes")
);
app.use(
  "/smartsaver-api/v1/categories",
  require("./src/routes/categoryRoutes")
);
app.use("/smartsaver-api/v1/incomes", require("./src/routes/incomeRoutes"));

const port = 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
