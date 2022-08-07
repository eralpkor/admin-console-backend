const router = require("express").Router();
const jwt = require("./middleware/jwtAccess");
const Helpers = require("./middleware/helpers");
const Payments = require("./auth-payments-model");
require("dotenv").config();

router.get("/payments", async (req, res) => {
  let columnName, order, columnId, id, startIndex, endIndex;

  if (req.query.range) {
    startIndex = await JSON.parse(req.query.range)[0];
    endIndex = await JSON.parse(req.query.range)[1];
  }
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

  Payments.find()
    .then((payments) => {
      res.setHeader(`Content-Range`, payments.length);
      const result = payments.slice(startIndex, endIndex);

      if (order === "ASC") {
        sorted = Helpers.sortAsc(result, columnName);
      }
      if (order === "DESC") {
        sorted = Helpers.sortDesc(result, columnName);
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

router.put("/payments/:id", (req, res) => {
  const body = req.body;
  // this is account/job id not payment id
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
      } else {
        res
          .status(400)
          .json({ message: "Cannot find this account in database..." });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Server error" });
    });
});

router.post("/payments", (req, res) => {
  const body = req.body;
  if (Helpers.isObjectEmpty(body))
    return res.status(409).json({ error: "Please enter something" });
  // this is account id not payment id
  Payments.addOne(body)
    .then((p) => {
      console.log("whats p ", p);
      res.status(201).json(p);
    })
    .catch((error) => {
      console.log("Server error ", error);
      res.status(500).json("server error ", error);
    });
});

module.exports = router;
