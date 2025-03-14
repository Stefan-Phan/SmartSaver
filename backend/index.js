const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./src/config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/smartsaver-api/v1/users", require("./src/routes/userRoutes"));

const port = 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
