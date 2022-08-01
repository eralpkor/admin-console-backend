const router = require("express").Router();
const jwt = require("./middleware/jwtAccess");
const Comments = require("./auth-comments-model");
require("dotenv").config();

router.get("/comments", async (req, res) => {
  let columnName, order, columnId, id;
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

      console.log(comments);
      let sorted = comments;
      if (order === "ASC") {
        sorted = Helpers.sortAsc(comments, columnName);
      }
      if (order === "DESC") {
        sorted = Helpers.sortDesc(comments, columnName);
      }
      res.status(200).json(sorted);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Cannot get comments" });
    });
});

module.exports = router;
