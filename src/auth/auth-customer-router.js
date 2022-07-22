const router = require("express").Router();
require("dotenv").config();
const Customers = require("./auth-customer-model");
const validateCustomer = require("./validateCustomer");

// GET all customers
router.get("/customers", (req, res) => {
  Customers.find()
    .then((customers) => {
      res.setHeader(`Content-Range`, customers.length);

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

  Customers.getCustomer(id)
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

  Customers.findByCustomerId(id)
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
