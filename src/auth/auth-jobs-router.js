const router = require("express").Router();
const jwt = require("./middleware/jwtAccess");
const Users = require("./auth-model");
const Jobs = require("./auth-jobs-model");
const Helpers = require("./middleware/helpers");
const Comments = require("./auth-comments-model");
const Payments = require("./auth-payments-model");
require("dotenv").config();
// http://localhost:5000/api/users?filter={"id":[3]}
// GET all jobs no-filter
// http://localhost:5000/api/jobs?filter={}&range=[0,9]&sort=["job_title","DESC"]
// http://localhost:5000/api/jobs?filter={"job_title":"job 2"}&range=[0,9]&sort=["id","ASC"]
router.get("/jobs", async (req, res) => {
  let result = [];
  let columnName, order, search, id, startIndex, endIndex;

  try {
    result = await Jobs.find();
  } catch (error) {
    res.status(500).json({ error: "Cannot get database..." });
  }

  if (req.query.range) {
    startIndex = await JSON.parse(req.query.range)[0];
    endIndex = await JSON.parse(req.query.range)[1];
    result = result.slice(startIndex, endIndex);
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
    search = await JSON.parse(req.query.filter);

    if (search.id) {
      result = result.filter((x) => search.id.includes(x.job_id));
    }
    if (search.job_title) {
      let query = search.job_title.toLowerCase().trim();

      result = result.filter((x) => {
        let j = x.job_title.toLowerCase();
        return j.includes(query);
      });
    }
    if (search.assigned_to) {
      let query = search.assigned_to.toLowerCase().trim();
      result = result.filter((x) => {
        let j = x.assigned_to.toLowerCase();
        return j.includes(query);
      });
    }
    if (search.last_name) {
      let query = search.last_name.toLowerCase().trim();
      result = result.filter((x) => {
        let j = x.last_name.toLowerCase();
        return j.includes(query);
      });
    }
    if (search.in_progress) {
      let query = search.in_progress.toLowerCase().trim();
      result = result.filter((x) => {
        let j = x.in_progress.toLowerCase();
        return j.includes(query);
      });
    }
  }
  res.setHeader(`Content-Range`, result.length);
  res.status(200).json(result);
});

// GET find job by ID
router.get("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  const job = await Jobs.findById(id);
  // const comments = await Comments.findByJobId(id);
  // let payments = await Payments.findByJobId(id);

  try {
    if (job) {
      // if (payments.length === 1 && payments[0].amount_paid === 0) {
      //   payments = [];
      // }

      res.status(200).json({ ...job }); // , comments, payments
    } else {
      res.status(400).json({ message: "That job does not exist" });
    }
  } catch (error) {
    console.log("Server error ", error);
    res.status(500).json({ error: "Server error " });
  }
});

// POST create a new job
router.post("/jobs", (req, res) => {
  const job = req.body;
  if (Helpers.isObjectEmpty(job))
    return res.status(409).json({ error: "Please enter something" });

  // add some validation for the database
  Jobs.addOne(job)
    .then((newJob) => {
      res.status(201).json(newJob);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT EDIT a single job
router.put("/jobs/:id", (req, res) => {
  // const userId = req.user.subject;
  const changes = req.body;
  const { id } = req.params;

  if (Object.keys(changes).length === 0) {
    res.status(422).json({ error: "Request body cannot be empty." });
  }

  Jobs.findById(id)
    .then((ids) => {
      if (ids) {
        Jobs.updateOne(id, changes)
          .then((job) => {
            res.status(200).json(job);
          })
          .catch((err) => {
            console.log(err);
            res.status(404).json({ error: "No change happened..." });
          });
      } else {
        res.status(404).json({ message: `No job with given id: ${id} ` });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Server error" });
    });
});

router.delete("/jobs/:id", (req, res) => {
  const { id } = req.params;

  Jobs.findById(id)
    .then((job) => {
      if (job) {
        Jobs.deleteOne(id)
          .then((job) => {
            console.log(job);
            res.status(201).json(job);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({ error: error });
          });
      } else {
        res.status(400).json({ message: `No job with 🆔 ${id} in database..` });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
});

// calculate balance
router.put("/jobs/:id");

module.exports = router;
