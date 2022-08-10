const router = require("express").Router();
require("dotenv").config();
const Customers = require("./auth-customer-model");
const validateCustomer = require("./validateCustomer");
const Helpers = require("./middleware/helpers");

// GET all customers
router.get("/customers", async (req, res) => {
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

  Customers.find()
    .then((customers) => {
      res.setHeader(`Content-Range`, customers.length);
      let sorted = customers;
      if (order === "ASC") {
        sorted = Helpers.sortAsc(customers, columnName);
      }
      if (order === "DESC") {
        sorted = Helpers.sortDesc(customers, columnName);
      }
      res.status(200).json(customers);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Cannot get customers..." });
    });
});

// GET single customer
router.get("/customers/:id", (req, res) => {
  const { id } = req.params;

  Customers.findById(id)
    .then((customer) => {
      if (customer) {
        res.status(200).json(customer);
      } else {
        res
          .status(400)
          .json({ message: "Cannot find customer in database..." });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Failed to get customer..." });
    });
});

// PUT EDIT customer
router.put("/customers/:id", (req, res) => {
  const changes = req.body;
  const { id } = req.params;

  if (Object.keys(changes).length === 0) {
    res.status(422).json({ error: "Request body cannot be empty." });
  }

  Customers.findById(id)
    .then((c) => {
      if (c.id == id) {
        Customers.updateCustomer(id, changes)
          .then((customer) => {
            res.status(200).json(customer);
          })
          .catch((error) => {
            console.log("Edit cust error ", error);
            res.status(404).json({ error: error });
          });
      } else {
        res.status(404).json({ error: "No customer with that id " });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: err });
    });
});

// POST Create customer
router.post("/customers", validateCustomer, (req, res) => {
  const customer = req.body;
  console.log(customer);
  Customers.addCustomer(customer)
    .then((c) => {
      res.status(201).json(c);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

module.exports = router;
