const express = require("express");

const app = express();
const PORT = 5000;

const cors = require("cors");
const { getDbConnection } = require("./db/DatabaseConnection");
const DB_CONNECTION_OK = require("./constants/database.constants");

//routes
const userRoutes = require("./components/auth/routes/userRoutes");
const budgetRoutes = require("./components/budget/routes/budgetRoute");
const materialRoutes = require("./components/materials/routes/materialRoutes")
const prRoutes = require("./components/pr/routes/prRoutes")
const mtRoutes = require("./components/materials/routes/materialTypeRoutes")
const mrRoutes = require('./components/pr/routes/mrRoutes')
const poRoutes = require("./components/po/routes/poRoutes")

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
app.use("/api/material",materialRoutes)
app.use("/api/pr",prRoutes)
app.use('/api/mr',mrRoutes)
app.use("/api/mt",mtRoutes)
app.use("/api/po",poRoutes)

app.listen(PORT, () => {
  console.log(`Backend server has started on port ${PORT}`);
});

getDbConnection().then(() => {
  console.log(DB_CONNECTION_OK);
});
