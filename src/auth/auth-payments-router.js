const router = require("express").Router();
const jwt = require("./middleware/jwtAccess");
const Users = require("./auth-model");
const Jobs = require("./auth-jobs-model");
const Helpers = require("./middleware/helpers");
const Payments = require("./auth-payments-model");
require("dotenv").config();

router.get("/payments", (req, res) => {
  const columnName = JSON.parse(req.query.sort)[0];
  const order = JSON.parse(req.query.sort)[1];
  Payments.find()
    .then((payments) => {
      res.setHeader(`Content-Range`, payments.length);
      console.log("payments ", payments);
      if (order === "ASC") {
        sorted = Helpers.sortAsc(payments, columnName);
      }
      if (order === "DESC") {
        sorted = Helpers.sortDesc(payments, columnName);
      }
      res.status(200).json(sorted);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Cannot get payments..." });
    });
});

router.get("/payments/:id", (req, res) => {
  const { id } = req.params;

  Payments.findById(id)
    .then((p) => {
      if (p) {
        res.status(200).json(p);
      } else {
        res.status(400).json({ message: "That payment does not exist" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Server error" });
    });
});

router.post("/payments", (req, res) => {
  const body = req.body;
  // this is account id not payment id
  const { id } = req.params;

  if (Helpers.isObjectEmpty(body))
    return res.status(409).json({ error: "Please enter something" });

  Payments.findById(id)
    .then((p) => {
      console.log(p);
      if (p) {
        Payments.addOne(body)
          .then((p) => {
            res.status(201).json(p);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Server error" });
    });
});

module.exports = router;
