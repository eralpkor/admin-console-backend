const router = require("express").Router();
const comment = require("./auth-comments-model");
const Helpers = require("./middleware/helpers");
require("dotenv").config();

// All comment
// http://localhost:5000/api/comment?filter={}&range=[10,19]&sort=["id","ASC"]
// http://localhost:5000/api/comment?filter={}&range=[0,24]&sort=["id","ASC"]
// http://localhost:5000/api/jobs?filter={"job_title":"investor"}&range=[0,24]&sort=["job_description","DESC"]
// http://localhost:5000/api/jobs?filter={}&range=[0,24]&sort=["job_description","DESC"]
router.get("/comment", async (req, res) => {
  let result = [];
  let columnName, order, limit, page, contentRange;

  try {
    result = await comment.find();
    contentRange = result.length;
  } catch (error) {
    res.status(500).json({ error: "Cannot get database..." });
  }

  // PAGINATION
  try {
    if (req.query.range) {
      page = await JSON.parse(req.query.range)[0];
      limit = await JSON.parse(req.query.range)[1];
      result = result.slice(page, limit);
    }
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
      let query = await JSON.parse(req.query.filter);
      if (query.jobId) {
        result = result.filter((x) => {
          return [query.jobId].includes(x.jobId);
        });
      }
      if (query.id) {
        result = result.filter((x) => query.id.includes(x.jobId));
      }
      if (query.comment) {
        let query = query.comment.toLowerCase().trim();
        result = result.filter((x) => {
          let c = x.comment.toLowerCase();
          return c.includes(query);
        });
      }
    }
  } catch (error) {
    console.log("Wrong JSON ", error);
  }
  res.setHeader(`Content-Range`, contentRange);
  res.status(200).json(result);
});

// CREATE comment
router.post("/comment", async (req, res) => {
  const body = req.body;
  if (Helpers.isObjectEmpty(body))
    return res.status(409).json({ error: "Please enter something" });

  comment
    .create(body)
    .then((comment) => {
      res.status(201).json(comment);
    })
    .catch((error) => {
      console.log("Comment POST error ", error);
      res.status(500).json("server error ", error);
    });
});

// GET single comment
router.get("/comment/:id", async (req, res) => {
  const { id } = req.params;
  const data = await comment.findById(id);

  try {
    if (data) {
      res.status(200).json({ ...data });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error ", error });
  }
});

router.put("/comment/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  if (Object.keys(changes).length === 0) {
    res.status(422).json({ error: "Request body cannot be empty." });
  }

  comment
    .findById(id)
    .then((ids) => {
      if (ids) {
        comment
          .update(id, changes)
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((err) => {
            console.log(err);
            res.status(404).json({ error: "No change happened..." });
          });
      } else {
        res.status(404).json({ message: `No comment with given id: ${id} ` });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Server error" });
    });
});

module.exports = router;
