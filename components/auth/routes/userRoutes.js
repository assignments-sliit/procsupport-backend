const express = require("express");
const routes = express.Router();

const userController = require("../controller/userController")

//create user
routes.post("/create",userController.createUser)

//get user by username
routes.get('/find/username/:username',userController.getUserByUsername)


module.exports = routes;