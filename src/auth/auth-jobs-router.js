const router = require("express").Router();
const jwt = require("./middleware/jwtAccess");
const Users = require("./auth-model");
const Jobs = require("./auth-jobs-model");
const Helpers = require("./middleware/helpers");
const Comments = require("./auth-comments-model");
const Payments = require("./auth-payments-model");
require("dotenv").config();
// http://localhost:5000/api/users?filter={"id":[3]}
// GET all jobs
// http://localhost:5000/api/jobs?filter={}&range=[0,9]&sort=["title","DESC"]
// http://localhost:5000/api/jobs?filter={"title":"job 2"}&range=[0,9]&sort=["id","ASC"]
router.get("/job", jwt.checkToken(), async (req, res) => {
  let result = [];
  let columnName, order, search, startIndex, endIndex;

  try {
    result = await Jobs.findMany();
  } catch (error) {
    res.status(500).json({ error: "Cannot get database..." });
  }

  try {
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
        result = result.filter((x) => search.id.includes(x.id));
      }
      if (search.title) {
        let query = search.title.toLowerCase().trim();

        result = result.filter((x) => {
          let j = x.title.toLowerCase();
          return j.includes(query);
        });
      }
      if (search.userId) {
        let query = search.userId.toLowerCase().trim();
        result = result.filter((x) => {
          let j = x.userId.toLowerCase();
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
      if (search.inProgress) {
        let query = search.inProgress.toLowerCase().trim();
        result = result.filter((x) => {
          let j = x.inProgress.toLowerCase();
          return j.includes(query);
        });
      }
    }
  } catch (error) {
    console.log("Wrong JSON ", error);
  }

  res.setHeader(`Content-Range`, result.length);
  res.status(200).json(result);
});

// GET find job by ID
router.get("/job/:id", jwt.checkToken(), async (req, res) => {
  const { id } = req.params;
  const job = await Jobs.findById(id);
  // const comments = await Comments.findByJobId(id);
  let payment = await Payments.findByJobId(id);

  try {
    if (job) {
      // if (payments.length === 1 && payments[0].amount_paid === 0) {
      //   payments = [];
      // }
      // res.status(200).json(job);
      res.status(200).json({ ...job, payment }); // , comments, payments
    } else {
      res.status(400).json({ message: "That job does not exist" });
    }
  } catch (error) {
    console.log("Server error ", error);
    res.status(500).json({ error: "Server error " });
  }
});

// POST create a new job
router.post("/job", jwt.checkToken(), (req, res) => {
  const job = req.body;
  if (Helpers.isObjectEmpty(job))
    return res.status(409).json({ error: "Please enter something" });

  // add some validation for the database
  Jobs.create(job)
    .then((newJob) => {
      res.status(201).json(newJob);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT EDIT a single job
router.put("/job/:id", jwt.checkToken(), async (req, res) => {
  // const userId = req.user.subject;
  const changes = req.body;
  const { id } = req.params;
  const job = await Jobs.findById(id);

  if (Object.keys(changes).length === 0) {
    res.status(422).json({ error: "Request body cannot be empty." });
  }

  try {
    if (job) {
      const updateJob = await Jobs.update(id, changes);
      const payment = await Payments.findByJobId(id);
      const comment = await Comments.findByJobId(id);
      const upJob = await Jobs.findById(id);
      res.status(201).json({ ...upJob, payment, comment });
    } else {
      console.log("No job");
      res.status(404).json({ message: `No job with given id: ${id} ` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }

  // Jobs.find(id)
  //   .then((ids) => {
  //     if (ids) {
  //       console.log("router ids ", ids);
  //       Jobs.update(id, changes)
  //         .then((job) => {
  //           console.log("update job ", job);
  //           res.status(200).json(job);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //           res.status(404).json({ error: "No change happened..." });
  //         });
  //     } else {
  //       res.status(404).json({ message: `No job with given id: ${id} ` });
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).json({ error: "Server error" });
  //   });
});

router.delete("/job/:id", jwt.checkToken(), (req, res) => {
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

module.exports = router;
