const router = require("express").Router();
const jwt = require("./middleware/jwtAccess");
const Helpers = require("./middleware/helpers");
const Payments = require("./auth-payments-model");
require("dotenv").config();

router.get("/payment", async (req, res) => {
  const role = req.decodedToken.role;
  let result = [];
  let columnName, order, limit, page, contentRange;

  try {
    result = await Payments.find();
    contentRange = result.length;
  } catch (error) {
    res.status(500).json({ error: "Cannot get database..." });
  }

  try {
    // Sort
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
    // Search
    if (req.query.filter) {
      let query = await JSON.parse(req.query.filter);

      if (!!Object.keys(query).length) {
        if (Array.isArray(query.id)) {
          result = result.filter((x) => {
            return query.id.includes(x.id);
          });
        }
        if (Number.isInteger(query.id)) {
          result = result.filter((x) => query.id === x.id);
        }
        if (query.jobId) {
          result = result.filter((x) => {
            return [query.jobId].includes(x.jobId);
          });
        }
        // Change content range to result length so pagination would have correct pages
        contentRange = result.length;
      }
    }
    // Pagination
    if (req.query.range) {
      page = await JSON.parse(req.query.range)[0];
      limit = await JSON.parse(req.query.range)[1];
      result = result.slice(page, limit);
    }
  } catch (error) {
    console.log("Wrong JSON ", error);
  }
  console.log("content ", contentRange);
  console.log("result ", result.length);
  res.setHeader(`Content-Range`, contentRange);
  res.status(200).json(result);
});

// Get payment by id
router.get("/payment/:id", (req, res) => {
  const { id } = req.params;

  Payments.findById(id)
    .then((data) => {
      if (data) {
        res.status(200).json({ ...data });
      } else {
        res.status(400).json({ message: "That payment does not exist" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Server error" });
    });
});

router.put("/payment/:id", (req, res) => {
  const body = req.body;
  const { id } = req.params;

  if (Helpers.isObjectEmpty(body))
    return res.status(409).json({ error: "Please enter something" });

  Payments.findById(id)
    .then((ids) => {
      if (ids) {
        Payments.update(id, body)
          .then((p) => {
            res.status(201).json(p);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      } else {
        res.status(400).json({ error: "cannot find this payment" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Server error" });
    });
});

// CREATE new payment
router.post("/payment", (req, res) => {
  const body = req.body;
  if (Helpers.isObjectEmpty(body))
    return res.status(409).json({ error: "Please enter something" });
  console.log("whats body ", body);
  Payments.create(body)
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
