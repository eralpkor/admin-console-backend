const router = require("express").Router();
const jwt = require("./middleware/jwtAccess");
const Helpers = require("./middleware/helpers");
const Log = require("./auth-log-model");
const UserJob = require("./user-jobs-model");
require("dotenv").config();

// GET single user jobs
router.get("/user-job", async (req, res) => {
  console.log("id ", req.body.userId);
  const userId = req.body.userId;
  let result = [];
  let columnName, order, limit, page, contentRange;

  try {
    result = await UserJob.find(userId);
    contentRange = result.length;

    // console.log("what user jobs ", result);
  } catch (error) {
    console.log("Wrong JSON ", error);
  }

  res.setHeader(`Content-Range`, contentRange);
  res.status(200).json(result);
});

module.exports = router;
