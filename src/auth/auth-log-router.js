const router = require("express").Router();
const jwt = require("./middleware/jwtAccess");
const Helpers = require("./middleware/helpers");
const Log = require("./auth-log-model");
require("dotenv").config();

// Get all logs
router.get("/log", async (req, res) => {
  console.log("query ", req.query);
  const role = req.decodedToken.role;
  let result = [];
  let data = [];
  let columnName, order, limit, page;

  try {
    result = await Log.find();
  } catch (error) {
    res.status(500).json({ error: "Cannot get database..." });
  }

  try {
    if (req.query.range) {
      page = await JSON.parse(req.query.range)[0];
      // endIndex = await JSON.parse(req.query.range)[1];
      limit = await JSON.parse(req.query.range)[1];
      // result = result.slice(startIndex, endIndex);
      console.log("page and limit ", page, limit);
      // console.log("page ", page);
      // console.log("limit ", limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      console.log("start end ", startIndex, endIndex);
      result = result.slice(page, limit);
      // console.log(result);

      if (endIndex < result.length) {
        // page = page + 1;
        // limit = limit;
        console.log("page ", page);
      }
      if (startIndex > 0) {
        page = page - 1;
        console.log("page ", page);
        console.log("linit 2 ", limit);
      }
      // console.log("whats indexes ", startIndex, endIndex);
      // // result = result.slice(startIndex, endIndex);
      // result = result.slice(endIndex, startIndex);
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
  // res.setHeader(`Content-Range`, result.length);
  // res.setHeader(`Content-Range`, `posts 0-9/100`);

  res.setHeader(`Content-Range`, `${page - limit}/${data.length}`);
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
