const mongoose = require("mongoose");

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
        const id = mongoose.Types.ObjectId();
        req.body._id = id;
        const newUser = new User(req.body);

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
