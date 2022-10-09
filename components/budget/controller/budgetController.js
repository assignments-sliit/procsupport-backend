const mongoose = require("mongoose");

const Budget = require("../models/Budget");

exports.createBudget = (req, res) => {
  const id = mongoose.Types.ObjectId();
  req.body._id = id;
  const budget = new Budget(req.body);

  budget
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Budget created",
        createdBudget: result,
        code: "BUDGET_CREATED",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        code: "UNKNOWN_ERROR",
      });
    });
};

exports.getEntireBudget = (req, res) => {
  let budget = 0;
  Budget.find()
    .exec()
    .then((allBudgetObjects) => {
      if (allBudgetObjects.length > 0) {
        allBudgetObjects.map((singleObject) => {
          budget = budget + parseInt(singleObject.amount);
        });

        res.status(200).json({
          amount: budget,
          currency: "LKR",
          code: "ENTIRE_BUDGET",
        });
      }
    });
};

exports.getGeneralBudget = (req, res) => {
  let budget = 0;
  Budget.find({
    budgetName: "GENERAL",
  })
    .exec()
    .then((allBudgetObjects) => {
      if (allBudgetObjects.length > 0) {
        allBudgetObjects.map((singleObject) => {
          budget = budget + parseInt(singleObject.amount);
        });
      }

      res.status(200).json({
        amount: budget,
        currency: "LKR",
        code: "ENTIRE_GENERAL_BUDGET",
      });
    });
};

exports.getPrBudget = (req, res) => {
  let budget = 0;
  Budget.find({
    budgetName: "PR",
  })
    .exec()
    .then((allBudgetObjects) => {
      if (allBudgetObjects.length > 0) {
        allBudgetObjects.map((singleObject) => {
          budget = budget + parseInt(singleObject.amount);
        });
      }

      res.status(200).json({
        amount: budget,
        currency: "LKR",
        code: "ENTIRE_PR_BUDGET",
      });
    });
};
