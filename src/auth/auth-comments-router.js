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
  let columnName, order, startIndex, endIndex;

  try {
    result = await comment.find();
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
      let search = await JSON.parse(req.query.filter);
      let { id } = await search;

      if (id) {
        result = result.filter((x) => id.includes(x.jobId));
      }
      if (search.comment) {
        let query = search.comment.toLowerCase().trim();
        result = result.filter((x) => {
          let c = x.comment.toLowerCase();
          return c.includes(query);
        });
      }
    }
  } catch (error) {
    console.log("Wrong JSON ", error);
  }
  res.setHeader(`Content-Range`, result.length);
  res.status(200).json(result);
});

// comment by jobId
router.post("/comment", async (req, res) => {
  const body = req.body;
  if (Helpers.isObjectEmpty(body))
    return res.status(409).json({ error: "Please enter something" });

  comment
    .addOne(body)
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
  console.log("edit comment ", id, changes);
  comment
    .findById(id)
    .then((ids) => {
      if (ids) {
        comment
          .updateOne(id, changes)
          .then((data) => {
            res.status(201).json(data);
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
