const router = require("express").Router();
const jwt = require("./middleware/jwtAccess");
const Users = require("./auth-model");
const Jobs = require("./auth-jobs-model");
const Accounts = require("./auth-accounts-model");
require("dotenv").config();

function isObjectEmpty(obj) {
  console.log(typeof obj);
  return Object.keys(obj).length === 0;
}

function sortAsc(arr, columnName) {
  return arr.sort((a, b) => {
    if (typeof a[columnName] === "number") {
      return a[columnName] - b[columnName];
    } else {
      return a[columnName].localeCompare(b[columnName]);
    }
  });
}

function sortDesc(arr, columnName) {
  return arr.sort((a, b) => {
    if (typeof a[columnName] === "number") {
      return b[columnName] - a[columnName];
    } else {
      return b[columnName].localeCompare(a[columnName]);
    }
  });
}
// http://localhost:5000/api/accounts?filter={}&range=[0,9]&sort=["id","DESC"]
router.get("/accounts", (req, res) => {
  const columnName = JSON.parse(req.query.sort)[0];
  const order = JSON.parse(req.query.sort)[1];

  Accounts.find()
    .then((accounts) => {
      res.setHeader(`Content-Range`, accounts.length);
      let sorted = accounts;

      if (order === "ASC") {
        sorted = sortAsc(accounts, columnName);
      }
      if (order === "DESC") {
        sorted = sortDesc(accounts, columnName);
      }
      res.status(200).json(sorted);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Cannot get accounts" });
    });
});

router.get("/accounts/:id", (req, res) => {
  const { id } = req.params;
  Accounts.findById(id)
    .then((account) => {
      account
        ? res.status(200).json(account)
        : res.status(400).json({ message: "That account does not exist" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Server error" });
    });
});

router.post("/accounts", (req, res) => {
  const account = req.body;
  console.log(account);
  if (isObjectEmpty(account)) {
    return res.status(409).json({ error: "Please enter something" });
  }
  Accounts.updateOne(account)
    .then((newAccount) => {
      console.log(newAccount);
      res.status(201).json(newAccount);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

router.put("/accounts/:id", (req, res) => {
  const changes = req.body;
  const { id } = req.params;
  if (isObjectEmpty(changes)) {
    return res.status(409).json({ error: "Please enter something" });
  }

  Accounts.findById(id)
    .then((ids) => {
      console.log(ids);
      if (ids) {
        Accounts.updateOne(id, changes)
          .then((acc) => {
            console.log(acc, changes);
            res.status(200).json(changes);
          })
          .catch((error) => {
            console.log(error);
            res.status(404).json({ error: "No change happened..." });
          });
      } else {
        res.status(404).json({ error: `No account with given id: ${id} ` });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Server error" });
    });
});

module.exports = router;
