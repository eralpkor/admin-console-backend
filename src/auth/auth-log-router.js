const router = require("express").Router();
const jwt = require("./middleware/jwtAccess");
const Helpers = require("./middleware/helpers");
const Log = require("./auth-log-model");
require("dotenv").config();

// Get all logs
router.get("/log", async (req, res) => {
  const role = req.decodedToken.role;
  let result = [];
  let columnName, order, limit, page, contentRange;

  try {
    result = await Log.find();
    contentRange = result.length;
  } catch (error) {
    res.status(500).json({ error: "Cannot get database..." });
  }

  try {
    if (req.query.range) {
      page = await JSON.parse(req.query.range)[0];
      limit = await JSON.parse(req.query.range)[1];

      result = result.slice(page, limit);
    }
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

    if (req.query.filter) {
      let query = await JSON.parse(req.query.filter);
      if (query.jobId) {
        result = result.filter((x) => {
          return [query.jobId].includes(x.jobId);
        });
      }

      if (query.id) {
        result = result.filter((x) => {
          return query.id.includes(x.id);
        });
      }
    }
  } catch (error) {
    console.log("Wrong JSON ", error);
  }
  res.setHeader(`Content-Range`, contentRange);
  res.status(200).json(result);
});

// GET single payment
router.get("/log/:id", async (req, res) => {
  const { id } = req.params;

  const log = await Log.findById(id);
  console.log("log ", log);
  try {
    if (log) {
      res.status(200).json({ ...log });
    } else {
      res.status(400).json({ message: "That log does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
