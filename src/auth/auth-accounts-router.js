const router = require("express").Router();
const jwt = require("./middleware/jwtAccess");
const Accounts = require("./auth-accounts-model");
const Helpers = require("./middleware/helpers");
require("dotenv").config();

router.get("/accounts", async (req, res) => {
  let columnName, order, columnId, id;
  if (req.query.sort) {
    columnName = await JSON.parse(req.query.sort)[0];
    order = await JSON.parse(req.query.sort)[1];
  }
  if (req.query.filter) {
    columnId = await JSON.parse(req.query.filter);
    if (columnId.id) {
      id = columnId.id[0];
    }
  }

  Accounts.find()
    .then((accounts) => {
      res.setHeader(`Content-Range`, accounts.length);
      let sorted = accounts;
      if (order === "ASC") {
        sorted = Helpers.sortAsc(accounts, columnName);
      }
      if (order === "DESC") {
        sorted = Helpers.sortDesc(accounts, columnName);
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
  if (Helpers.isObjectEmpty(account)) {
    return res.status(409).json({ error: "Please enter something" });
  }
  Accounts.updateOne(account)
    .then((newAccount) => {
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
  if (Helpers.isObjectEmpty(changes)) {
    return res.status(409).json({ error: "Please enter something" });
  }

  Accounts.findById(id)
    .then((ids) => {
      if (ids) {
        Accounts.updateOne(id, changes)
          .then((acc) => {
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
