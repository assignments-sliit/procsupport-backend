const express = require("express");

const app = express();
const PORT = 5000;

const cors = require("cors");
const { getDbConnection } = require("./db/DatabaseConnection");
const DB_CONNECTION_OK = require("./constants/database.constants");

const userRoutes = require("./components/auth/routes/userRoutes");
const budgetRoutes = require("./components/budget/routes/budgetRoute");

app.use(cors());
app.use(express.json());

app.all((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/users", userRoutes);
app.use("/api/budget", budgetRoutes);

app.listen(PORT, () => {
  console.log(`Backend server has Started on port ${PORT}`);
});

getDbConnection().then(() => {
  console.log(DB_CONNECTION_OK);
});
