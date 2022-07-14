const router = require("express").Router();
const jwt = require("./middleware/jwtAccess");
const Users = require("./auth-model");
const Jobs = require("./auth-jobs-model");
require("dotenv").config();

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function sortAsc(arr, columnName) {
  return arr.sort((a, b) => {
    if (typeof a[columnName] === "number") {
      return a[columnName] - b[columnName];
    } else {
      return a[columnName].localeCompare(b[columnName]);
    }
  });
}

function sortDesc(arr, columnName) {
  return arr.sort((a, b) => {
    if (typeof a[columnName] === "number") {
      return b[columnName] - a[columnName];
    } else {
      return b[columnName].localeCompare(a[columnName]);
    }
  });
}
// GET all jobs no-filter
// http://localhost:5000/api/jobs?filter={}&range=[0,9]&sort=["job_title","DESC"]
router.get("/jobs", (req, res) => {
  const columnName = JSON.parse(req.query.sort)[0];
  const order = JSON.parse(req.query.sort)[1];

  Jobs.findAllJobs()
    .then((jobs) => {
      // added for admin-console
      res.setHeader(`Content-Range`, jobs.length);
      let sortedJobs = jobs;
      // console.log(sortedJobs);

      if (order === "ASC") {
        sortedJobs = sortAsc(jobs, columnName);
      }
      if (order === "DESC") {
        sortedJobs = sortDesc(jobs, columnName);
      }
      res.status(200).json(sortedJobs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Cannot get jobs..." });
    });
});

// POST create a new job
router.post("/jobs/create", (req, res) => {
  const job = req.body;
  console.log(job);
  if (isObjectEmpty(job))
    res.status(409).json({ error: "Please enter something" });

  // add some validation for the database
  Jobs.addJob(job)
    .then((newJob) => {
      res.status(201).json(newJob);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET find job by ID
router.get("/jobs/:id", (req, res) => {
  const { id } = req.params;
  console.log("whats params ", id);

  Jobs.findById(id)
    .then((job) => {
      console.log("what is job ", job);

      if (job) {
        console.log("what is job", job);
        res.status(200).json(job);
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

// GET jobs by user/admin id
router.get("/jobs/user-job/:id", (req, res, next) => {
  const id = req.params.id;

  Users.findById(id)
    .then((ids) => {
      if (!ids) {
        console.log("user do not exist");
        res.status(404).json({ message: "That user does not exist " });
      } else {
        Jobs.findByUserId(id)
          .then((jobs) => {
            if (jobs.length > 0) {
              res.status(200).json({ jobs: jobs });
            } else {
              res
                .status(400)
                .json({ message: "You did not create any jobs yet " });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ err: "Server error..." });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err: "Server error..." });
    });
});

// GET jobs by progress status
// example /jobs?customer_id=desc
// example /jobs?in_progress=asc
// http://localhost:5000/api/jobs?filter={}&range=[0,9]&sort=["job_title","DESC"]
// router.get("/jobs", (req, res) => {
//   // const sort = {
//   //   field: Object.keys(req.query)[0],
//   //   order: Object.values(req.query)[0],
//   // };
//   console.log("What is query", req.query.sort[0]);

//   // const sortByName = Object.keys(req.query)[0];
//   // const order = Object.values(req.query)[0];
//   // console.log("What is direction ", sort.order);
//   // console.log("sortbyname ", sort.field);
//   Jobs.sortByFieldName(req.query.sort[0], sort.order)
//     .then((jobs) => {
//       console.log("Jobs: ", jobs);
//       if (jobs.length === 0) {
//         res.status(404).json({ message: "No jobs" });
//       } else {
//         res.status(200).json({ jobs: jobs });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ error: "Server error..." });
//     });
// });

// PUT EDIT a single job
router.put("/jobs/:id", (req, res) => {
  // const userId = req.user.subject;
  const changes = req.body;
  const { id } = req.params;
  console.log(id);
  if (Object.keys(changes).length === 0) {
    res.status(422).json({ error: "Request body cannot be empty." });
  }

  Jobs.findById(id).then((ids) => {
    console.log("JOB ids ", ids);
    if (ids) {
      Jobs.updateJob(id, changes)
        .then((job) => {
          res.status(200).json(changes);
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json({ error: "No change happened..." });
        });
    } else {
      res.status(404).json({ message: `No job with given id: ${id} ` });
    }
  });
  // Users.findById(userId)
  //   .then((u) => {
  //     if (u.id === userId) {
  //       Jobs.findById(id).then((ids) => {
  //         console.log("JOB ids ", ids);
  //         if (ids) {
  //           Jobs.updateJob(id, changes)
  //             .then((job) => {
  //               res.status(200).json({
  //                 message: `${Object.keys(changes)} updated successfully. `,
  //                 changes,
  //               });
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //               res.status(404).json({ error: "No change happened..." });
  //             });
  //         } else {
  //           res.status(404).json({ message: `No job with given id: ${id} ` });
  //         }
  //       });
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).json({ error: err });
  //   });
});

router.delete("/jobs/:id", (req, res) => {
  const { id } = req.params;

  Jobs.findById(id)
    .then((job) => {
      console.log(job);
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
