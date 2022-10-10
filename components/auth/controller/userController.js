const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys.json");
const JWT_KEY = keys.JWT_KEY;
const Users = require("../models/UserSchema");

//middleware pattern

exports.createUser = (req, res, next) => {
  Users.findOne({
    username: req.body.username,
  })
    .exec()
    .then((user) => {
      if (user) {
        res.status(409).json({
          message: "User already exists",
          error: "User already exists",
          code: "USER_EXISTS",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
              code: "UNKNOWN_ERROR",
            });
          } else {
            const id = mongoose.Types.ObjectId();
            req.body._id = id;
            req.body.password = hash;
            const newUser = new Users(req.body);

            newUser
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "User created",
                  createdUser: result,
                  code: "USER_CREATED",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                  code: "UNKNOWN_ERROR",
                });
              });
          }
        });
      }
    });
};

exports.getUserByUsername = (req, res) => {
  const username = req.params.username;

  Users.findOne({
    username: username,
  })
    .exec()
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: "User found",
          user: user,
          code: "USER_FOUND",
        });
      }

      if (!user) {
        res.status(404).json({
          message: "User not found",
          code: "USER_NOT_FOUND",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        code: "UNKNOWN_ERROR",
      });
    });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  Users.findOne({
    username: username,
  })
    .exec()
    .then((foundUser) => {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, (err, result) => {
          if (err) {
            return res.status(401).json({
              error: "Incorrect Password",
              code: "INCORRECT_PASSWORD",
            });
          }

          if (result) {
            //correct password
            const token = jwt.sign(
              {
                id: foundUser._id,
                username: foundUser.username,
                usertype: foundUser.usertype,
              },
              JWT_KEY,
              {
                expiresIn: "24h",
              }
            );
            console.log(student);
            return res.status(200).json({
              message: "Authorization Success",
              token: token,
              code: "AUTH_SUCCESS",
            });
          }
          res.status(401).json({
            error: "Authorization Failed!",
            code: "AUTH_FAILED",
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
        code: "UNKNOWN_ERROR",
      });
    });
};

exports.deleteUser = (req, res) => {
  Users.deleteOne({
    username:req.body.username
  }).then((deleted)=>{
    res.status(200).json({
      message:"User Deleted",
      code:"USER_DELETED"
    })
  }).catch((err)=>{
    res.status(500).json({
      error:err,
      code:"UNKNOWN_ERROR"
    })
  })
};

