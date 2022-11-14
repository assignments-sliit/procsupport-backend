const express = require("express");
const routes = express.Router();

const userController = require("../controller/userController")

//create user
routes.post("/create",userController.createUser)

//get user by username
routes.get('/find/username/:username',userController.getUserByUsername)

//routes.get('/login')
routes.post('/login',userController.login)

//get user type 
routes.get('/get/type/:username',userController.getUserType)

//get user type from token
routes.get('/get/usertype/token',userController.getUserTypeFromToken)

//check user type
routes.get('/type/check', userController.checkUserType)

module.exports = routes;