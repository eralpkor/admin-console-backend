const router = require("express").Router();
const jwt = require("./middleware/jwtAccess");
const Comments = require("./auth-comments-model");
const Helpers = require("./middleware/helpers");
require("dotenv").config();

// All comments
// http://localhost:5000/api/comments?filter={}&range=[10,19]&sort=["id","ASC"]
// http://localhost:5000/api/comments?filter={}&range=[0,24]&sort=["id","ASC"]
// http://localhost:5000/api/jobs?filter={"job_title":"investor"}&range=[0,24]&sort=["job_description","DESC"]
// http://localhost:5000/api/jobs?filter={}&range=[0,24]&sort=["job_description","DESC"]
router.get("/comments", async (req, res) => {
  let columnName, order, columnId, id, startIndex, endIndex;

  if (req.query.range) {
    startIndex = await JSON.parse(req.query.range)[0];
    endIndex = await JSON.parse(req.query.range)[1];
  }
  if (req.query.sort) {
    columnName = await JSON.parse(req.query.sort)[0];
    order = await JSON.parse(req.query.sort)[1];
  }
  if (req.query.filter) {
    columnId = await JSON.parse(req.query.filter);

    if (columnId.id) {
      id = columnId.id[0];
    }
  }

  Comments.find()
    .then((comments) => {
      res.setHeader(`Content-Range`, comments.length);
      const result = comments.slice(startIndex, endIndex);
      let sorted = result;

      if (order === "ASC") {
        sorted = Helpers.sortAsc(result, columnName);
      }
      if (order === "DESC") {
        sorted = Helpers.sortDesc(result, columnName);
      }
      res.status(200).json(sorted);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Cannot get comments" });
    });
});

// comments by jobId
router.post("/comments", async (req, res) => {
  const body = req.body;
  if (Helpers.isObjectEmpty(body))
    return res.status(409).json({ error: "Please enter something" });

  Comments.addOne(body)
    .then((comment) => {
      console.log("Do we get comments ", comment);
      res.status(201).json(comment);
    })
    .catch((error) => {
      console.log("Comment POST error ", error);
      res.status(500).json("server error ", error);
    });
});

module.exports = router;
