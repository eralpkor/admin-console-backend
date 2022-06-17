const router = require("express").Router();
require("dotenv").config();
const HashFactor = parseInt(process.env.HASH) || 8;
const validateNewUser = require("./validNewUser");
const validateLogin = require("./validLoginUser");
const bcrypt = require("bcryptjs");
const jwt = require("./middleware/jwtAccess");
const Users = require("./auth-model");
const Jobs = require("./auth-jobs-model");
const omit = require("../helpers/omit");

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// GET all jobs no-filter
router.get("/jobs", (req, res) => {
  Jobs.find()
    .then((jobs) => {
      res.status(200).json({ jobs: jobs });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Cannot get posts..." });
    });
});

// POST create a new job
router.post("/jobs/create", (req, res) => {
  const job = req.body;
  console.log(job);
  if (isObjectEmpty(job))
    res.status(409).json({ error: "Please enter something" });

  Jobs.addJob(job)
    .then((newJob) => {
      res
        .status(201)
        .json({ message: `New Job Created with title: ${newJob.job_title} ` });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET find job by filter any
router.get("/jobs/filter", (req, res) => {
  const filter = req.query;
  console.log("whats query ", filter);

  Jobs.findBy(filter)
    .then((job) => {
      if (job) {
        res.status(200).json({ job: job });
      } else {
        res.status(400).json({ message: "That job does not exist" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Server error" });
    });
});

// GET jobs by single customer by id.
router.get("/jobs/customer-job/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  Jobs.findByCustomerId(id)
    .then((jobs) => {
      if (jobs.length) {
        res.status(200).json({ jobs: jobs });
      } else {
        res.status(400).json({ message: "No job for that user yet... " });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Server error.. " });
    });
});

module.exports = router;
