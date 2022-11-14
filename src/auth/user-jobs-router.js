const router = require("express").Router();
const jwt = require("./middleware/jwtAccess");
const Helpers = require("./middleware/helpers");
const Log = require("./auth-log-model");
const UserJob = require("./user-jobs-model");
const Jobs = require("./auth-jobs-model");
require("dotenv").config();

// GET single user jobs
router.get("/user-job", async (req, res) => {
  // console.log("id ", req.body.userId);
  // const userId = req.body.userId;
  let result = [];
  // let contentRange = 0;
  let columnName, order, limit, page, contentRange;
  // console.log("whats user id ", userId);

  try {
    // result = await UserJob.find(userId);
    result = await Jobs.findMany();
    contentRange = result.length;
  } catch (error) {
    console.log("Wrong JSON ", error);
    res.status(500).json({ error: "Cannot get database..." });
  }

  try {
    if (req.query.range) {
      page = await JSON.parse(req.query.range)[0];
      limit = await JSON.parse(req.query.range)[1];

      result = result.slice(page, limit);
      console.log("result range ", result.length);
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
      console.log("sort ", result.length);
    }

    if (req.query.filter) {
      let query = await JSON.parse(req.query.filter);
      console.log("filter ", result.length);
      if (query.userId) {
        result = result.filter((x) => {
          return [query.userId].includes(x.userId);
        });
        console.log("whats result ", result.length);
        // contentRange = result.length;
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
  console.log("user job content ", contentRange);
  res.setHeader(`Content-Range`, contentRange);
  res.status(200).json(result);
});

module.exports = router;
