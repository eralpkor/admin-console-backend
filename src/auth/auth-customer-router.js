const router = require("express").Router();
require("dotenv").config();
const Customers = require("./auth-customer-model");
const validateCustomer = require("./validateCustomer");
const Helpers = require("./middleware/helpers");

// GET all customers
router.get("/customer", async (req, res) => {
  const filters = req.query;
  const role = req.decodedToken.role;
  let result = [];
  let columnName, order, limit, page, contentRange;

  try {
    result = await Customers.find();
    contentRange = result.length;
  } catch (error) {
    res.status(500).json({ error: "Cannot get database..." });
  }

  try {
    // SORT order
    if (req.query.sort) {
      columnName = await JSON.parse(req.query.sort)[0];
      order = await JSON.parse(req.query.sort)[1];
      if (order === "ASC") {
        result = Helpers.sortAsc(result, columnName);
      }
      if (order === "DESC") {
        result = Helpers.sortDesc(result, columnName);
      }
    }
    // SEARCH
    if (req.query.filter) {
      let search = await JSON.parse(req.query.filter);

      if (!!Object.keys(search).length) {
        if (Array.isArray(search.id)) {
          result = result.filter((x) => {
            return search.id.includes(x.id);
          });
        }
        if (Number.isInteger(search.id)) {
          result = result.filter((x) => search.id === x.id);
        }
        // Change content range to result length so pagination would have correct pages
        contentRange = result.length;
      }

      if (search.q) {
        let q = search.q.toLowerCase().trim();

        result = result.filter((x) => {
          let firstName = x.firstName.toLowerCase();
          let lastName = x.lastName.toLowerCase();
          return lastName.includes(q);
        });
      }
      // PAGINATION
      if (req.query.range) {
        page = await JSON.parse(req.query.range)[0];
        limit = await JSON.parse(req.query.range)[1];
        result = result.slice(page, limit);
      }

      if (search.firstName) {
        let query = search.firstName.toLowerCase().trim();

        result = result.filter((x) => {
          let j = x.firstName.toLowerCase();
          return j.includes(query);
        });
      }
      if (search.lastName) {
        let query = search.lastName.toLowerCase().trim();

        result = result.filter((x) => {
          let j = x.lastName.toLowerCase();
          return j.includes(query);
        });
      }
      if (search.email) {
        let query = search.email.toLowerCase().trim();

        result = result.filter((x) => {
          let j = x.email.toLowerCase();
          return j.includes(query);
        });
      }
      if (search.company) {
        let query = search.company.toLowerCase().trim();

        result = result.filter((x) => {
          let j = x.company.toLowerCase();
          return j.includes(query);
        });
      }
    }
  } catch (error) {
    console.log("Wrong JSON ", error);
  }
  // console.log("content ", contentRange);
  // console.log("result ", result.length);
  res.setHeader(`Content-Range`, contentRange);
  res.status(200).json(result);
});

// GET single customer
router.get("/customer/:id", (req, res) => {
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

// PUT EDIT/UPDATE customer
router.put("/customer/:id", (req, res) => {
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
router.post("/customer", validateCustomer, (req, res) => {
  const customer = req.body;
  console.log(customer);
  Customers.create(customer)
    .then((c) => {
      res.status(201).json(c);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});

module.exports = router;
