const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./src/config/db");

const app = express();
const port = process.env.PORT || 5001;

const server = require("http").createServer(app);

// ✅ Init Socket.IO
const { initSocket } = require("./src/socket/socket");
initSocket(server);

app.use(cors());
app.use(express.json());

// Routes
app.use("/smartsaver-api/v1/auth", require("./src/routes/authRoutes"));
app.use("/smartsaver-api/v1/users", require("./src/routes/userRoutes"));
app.use("/smartsaver-api/v1/api/ai", require("./src/routes/aiRecommendation"));
app.use(
  "/smartsaver-api/v1/transaction",
  require("./src/routes/transactionRoutes")
);
app.use(
  "/smartsaver-api/v1/categories",
  require("./src/routes/categoryRoutes")
);

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
